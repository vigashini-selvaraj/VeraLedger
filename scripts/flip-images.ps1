Add-Type -AssemblyName System.Drawing

function Flip-Image($src, $dst) {
    $fullSrc = [System.IO.Path]::GetFullPath($src)
    $fullDst = [System.IO.Path]::GetFullPath($dst)
    $img = [System.Drawing.Image]::FromFile($fullSrc)
    $bmp = New-Object System.Drawing.Bitmap($img)
    $bmp.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX)
    
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]98)
    
    $img.Dispose()
    $bmp.Save($fullDst, $codec, $encParams)
    $bmp.Dispose()
    Write-Output "Flipped: $dst"
}

Flip-Image "images/hero-vibrant-advisor.jpg" "images/hero-vibrant-advisor-rtl.jpg"
Flip-Image "images/home2-vibrant-tax.jpg" "images/home2-vibrant-tax-rtl.jpg"
Flip-Image "images/hero-bg-finance.jpg" "images/hero-bg-finance-rtl.jpg"
Flip-Image "images/login-financial-art.jpg" "images/login-financial-art-rtl.jpg"
Flip-Image "images/home2-bg-tax.jpg" "images/home2-bg-tax-rtl.jpg"
Flip-Image "images/blog-gemini-hero.jpg" "images/blog-gemini-hero-rtl.jpg"
Flip-Image "images/contact-gemini-hero.jpg" "images/contact-gemini-hero-rtl.jpg"
Flip-Image "images/pricing-gemini-hero.jpg" "images/pricing-gemini-hero-rtl.jpg"
