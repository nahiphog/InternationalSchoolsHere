param([Parameter(Mandatory=$true)][string]$InputFile,[Parameter(Mandatory=$true)][string]$OutputFile)
$targets=Get-Content -LiteralPath $InputFile -Raw | ConvertFrom-Json
$results=$targets | ForEach-Object -ThrottleLimit 8 -Parallel {
 $url=$_
 try {
  $response=Invoke-WebRequest $url -TimeoutSec 35
  $html=$response.Content
  $links=@([regex]::Matches($html,'<a[^>]+href=["'']([^"'']+)["''][^>]*>([\s\S]*?)</a>') | ForEach-Object {
   @{url=[System.Net.WebUtility]::HtmlDecode($_.Groups[1].Value);name=([System.Net.WebUtility]::HtmlDecode([regex]::Replace($_.Groups[2].Value,'<[^>]+>',' ')) -replace '\s+',' ').Trim()}
  })
  $emails=@([regex]::Matches($html,'[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}') | ForEach-Object {$_.Value})
  $emails+=@([regex]::Matches($html,'data-cfemail="([0-9a-f]+)"') | ForEach-Object { $v=$_.Groups[1].Value;$key=[Convert]::ToInt32($v.Substring(0,2),16);-join $(for($i=2;$i -lt $v.Length;$i+=2){[char]([Convert]::ToInt32($v.Substring($i,2),16) -bxor $key)}) })
  $body=[regex]::Replace($html,'(?is)<(script|style|noscript)\b[^>]*>.*?</\1>',' ')
  $body=[regex]::Replace($body,'<[^>]+>',' ')
  @{url=$url;finalUrl=$response.BaseResponse.RequestMessage.RequestUri.AbsoluteUri;checked='2026-10-31';text=([System.Net.WebUtility]::HtmlDecode($body) -replace '\s+',' ').Trim();links=$links;emails=@($emails | Sort-Object -Unique)}
 }catch { @{url=$url;error=$_.Exception.Message} }
}
$results | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $OutputFile -Encoding utf8
$results | ForEach-Object { "$($_.url) | $($_.text.Length) chars | $($_.error)" }
