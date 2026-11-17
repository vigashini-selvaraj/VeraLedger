Add-Type -AssemblyName System.Drawing

function Crop-Image($src, $dst, $xPercent, $yPercent, $wPercent, $hPercent) {
    $fullSrc = [System.IO.Path]::GetFullPath($src)
    $fullDst = [System.IO.Path]::GetFullPath($dst)
    $img = [System.Drawing.Image]::FromFile($fullSrc)
    
    $x = [int]($img.Width * $xPercent)
    $y = [int]($img.Height * $yPercent)
    $w = [int]($img.Width * $wPercent)
    $h = [int]($img.Height * $hPercent)
    
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    $g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $w, $h)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
    
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]98)
    
    $g.Dispose()
    $img.Dispose()
    $bmp.Save($fullDst, $codec, $encParams)
    $bmp.Dispose()
    Write-Output "Cropped: $dst"
}

# Crop right visual side
Crop-Image "images/blog-hero-gemini.jpg" "images/blog-hero-visual.jpg" 0.42 0.0 0.58 1.0
Crop-Image "images/contact-hero-gemini.jpg" "images/contact-hero-visual.jpg" 0.44 0.0 0.56 1.0
Crop-Image "images/pricing-hero-gemini.jpg" "images/pricing-hero-visual.jpg" 0.45 0.0 0.55 1.0

# Also create RTL flipped versions of the visual
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

Flip-Image "images/blog-hero-visual.jpg" "images/blog-hero-visual-rtl.jpg"
Flip-Image "images/contact-hero-visual.jpg" "images/contact-hero-visual-rtl.jpg"
Flip-Image "images/pricing-hero-visual.jpg" "images/pricing-hero-visual-rtl.jpg"
