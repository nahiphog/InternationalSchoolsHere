$ErrorActionPreference = 'Stop'
# Page bounds belong to the dated snapshot. Reconcile reported totals below before writing;
# a future directory expansion must fail visibly rather than silently omit later pages.
$targets = @()
foreach ($region in @('selangor','kuala-lumpur','putrajaya')) {
  $pages = if ($region -eq 'selangor') { 6 } elseif ($region -eq 'kuala-lumpur') { 4 } else { 1 }
  for ($page=1; $page -le $pages; $page++) { $targets += "https://educationdestinationmalaysia.com/schools/${region}?page=$page" }
  $pages = if ($region -eq 'selangor') { 4 } elseif ($region -eq 'kuala-lumpur') { 3 } else { 1 }
  for ($page=1; $page -le $pages; $page++) { $targets += "https://www.my-schools.com/en/states/${region}?page=$page" }
}
$targets += 'https://international-schools-guide.com/cities/kuala-lumpur/'
$results = $targets | ForEach-Object -ThrottleLimit 6 -Parallel {
  $url=$_
  try {
    $html=(Invoke-WebRequest $url -TimeoutSec 45).Content
    $links=@([regex]::Matches($html,'<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)</a>') | ForEach-Object {
      $href=[System.Net.WebUtility]::HtmlDecode($_.Groups[1].Value)
      $name=[System.Net.WebUtility]::HtmlDecode([regex]::Replace($_.Groups[2].Value,'<[^>]+>',' ')) -replace '\s+',' '
      if (($href -match '/school/' -or $href -match '/en/schools/' -or $href -match '/cities/kuala-lumpur/[^/]+/') -and $name.Trim() -and $name.Trim() -ne 'View Details') { @{url=([uri]::new([uri]$url,$href).AbsoluteUri);name=($name.Trim() -replace ' MYR.*| —$','')} }
    })
    @{url=$url;fetched='2026-10-31';reportedCounts=@([regex]::Matches($html,'(?:Total of \d+ schools found|Showing \d+ to \d+ of \d+ results)') | ForEach-Object {$_.Value});links=$links}
  } catch { @{url=$url;error=$_.Exception.Message} }
}
if (@($results | Where-Object error).Count) { throw 'A discovery page failed; retain the previous inventory and inspect the fetch failures.' }
foreach ($group in ($results | Where-Object {$_.url -notmatch 'international-schools-guide'} | Group-Object {$_.url -replace '\?page=\d+',''})) {
  $reported = @($group.Group.reportedCounts | ForEach-Object { if ($_ -match 'Total of (\d+) schools found|of (\d+) results') { if ($Matches[1]) {[int]$Matches[1]} else {[int]$Matches[2]} } } | Sort-Object -Unique)
  $actual = @($group.Group.links.url | Sort-Object -Unique).Count
  if ($reported.Count -ne 1 -or $reported[0] -ne $actual) { throw "Coverage mismatch for $($group.Name): $actual profiles versus reported $reported. Inspect pagination before saving." }
}
$results | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath "$PSScriptRoot/coverage-source-inventory-2026-10-31.json" -Encoding utf8
$results | ForEach-Object { "$($_.url) | $($_.links.Count) links | $($_.error)" }
