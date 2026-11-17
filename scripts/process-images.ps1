Add-Type -AssemblyName System.Drawing

function Process-Image {
    param (
        [string]$srcPath,
        [string]$dstPath,
        [float]$scale = 1.0,
        [float]$offset = 0.0,
        [bool]$flipX = $false
    )

    $fullSrc = [System.IO.Path]::GetFullPath($srcPath)
    $fullDst = [System.IO.Path]::GetFullPath($dstPath)

    $img = [System.Drawing.Image]::FromFile($fullSrc)
    $bmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $matrix = New-Object 'float[][]' 5
    $matrix[0] = [float[]]@($scale, 0, 0, 0, 0)
    $matrix[1] = [float[]]@(0, $scale, 0, 0, 0)
    $matrix[2] = [float[]]@(0, 0, $scale, 0, 0)
    $matrix[3] = [float[]]@(0, 0, 0, 1, 0)
    $matrix[4] = [float[]]@($offset, $offset, $offset, 0, 1)

    $cm = New-Object System.Drawing.Imaging.ColorMatrix(,$matrix)
    $ia = New-Object System.Drawing.Imaging.ImageAttributes
    $ia.SetColorMatrix($cm)

    $rect = New-Object System.Drawing.Rectangle(0, 0, $img.Width, $img.Height)
    $g.DrawImage($img, $rect, 0, 0, $img.Width, $img.Height, [System.Drawing.GraphicsUnit]::Pixel, $ia)

    if ($flipX) {
        $bmp.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX)
    }

    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]95)

    $g.Dispose()
    $img.Dispose()
    $ia.Dispose()

    $tempDst = $fullDst + ".tmp.jpg"
    $bmp.Save($tempDst, $codec, $encParams)
    $bmp.Dispose()

    Move-Item -Path $tempDst -Destination $fullDst -Force
    Write-Output "Saved: $dstPath"
}

# 1. Brighten hero-vibrant-advisor.jpg slightly (+10% contrast, +4% brightness for vibrant realism)
Process-Image -srcPath "images/hero-vibrant-advisor.jpg" -dstPath "images/hero-vibrant-advisor.jpg" -scale 1.06 -offset 0.03
Process-Image -srcPath "images/hero-vibrant-advisor.jpg" -dstPath "images/hero-vibrant-advisor-rtl.jpg" -scale 1.0 -offset 0.0 -flipX $true

# 2. Brighten home2-vibrant-tax.jpg
Process-Image -srcPath "images/home2-vibrant-tax.jpg" -dstPath "images/home2-vibrant-tax.jpg" -scale 1.06 -offset 0.03
Process-Image -srcPath "images/home2-vibrant-tax.jpg" -dstPath "images/home2-vibrant-tax-rtl.jpg" -scale 1.0 -offset 0.0 -flipX $true

# 3. Brighten contact advisor image hero-bg-advisor.jpg (+14% contrast & brightness so right side is crisp, vibrant, real)
Process-Image -srcPath "images/hero-bg-advisor.jpg" -dstPath "images/hero-bg-advisor.jpg" -scale 1.12 -offset 0.05
Process-Image -srcPath "images/hero-bg-advisor.jpg" -dstPath "images/hero-bg-advisor-rtl.jpg" -scale 1.0 -offset 0.0 -flipX $true
