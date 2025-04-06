# Define the path to scan
$Path = ".\src\app\(page)\gallery"  # Change this if needed

# Define folders to exclude (add your exclusions here)
$ExcludeFolders = @("dashboard", "services")  # Example exclusions

# Define the output file
$OutputFile = "src_structure_with_code.txt"

# Create array to store code files for later processing
$Global:CodeFiles = @()

# Ensure file is created before writing to it
Set-Content -Path $OutputFile -Value "📁 Directory Structure" -Encoding UTF8

# Function to generate the directory tree structure only
function Get-DirectoryTree {
    param (
        [string]$Path,
        [int]$Level = 0,
        [bool]$IsLast = $false,
        [array]$ExcludeFolders
    )

    # Indentation setup
    $Indent = ""
    if ($Level -gt 0) {
        $Indent = ("│   " * ($Level - 1))
        if ($IsLast) {
            $Indent += "└── "
        } else {
            $Indent += "├── "
        }
    }

    # Get directories and files, excluding specified folders
    $Directories = Get-ChildItem -Path $Path -Directory | 
                   Where-Object { $ExcludeFolders -notcontains $_.Name } | 
                   Sort-Object Name
    $Files = Get-ChildItem -Path $Path -File | Sort-Object Name

    # Print directories first
    for ($i = 0; $i -lt $Directories.Count; $i++) {
        $Dir = $Directories[$i]
        $IsLastDir = ($i -eq $Directories.Count - 1) -and ($Files.Count -eq 0)
        "$Indent$($Dir.Name)/" | Out-File -Append -FilePath $OutputFile -Encoding UTF8
        Get-DirectoryTree -Path $Dir.FullName -Level ($Level + 1) -IsLast $IsLastDir -ExcludeFolders $ExcludeFolders
    }

    # Print files and collect code files
    foreach ($File in $Files) {
        "$Indent$($File.Name)" | Out-File -Append -FilePath $OutputFile -Encoding UTF8

        # If it's a code file, add to array for later processing
        $FileExtension = $File.Extension.ToLower()
        if ($FileExtension -in @(".js", ".ts", ".jsx", ".tsx", ".json", ".css", ".py", ".html")) {
            $Global:CodeFiles += @{
                Path = $File.FullName
                Name = $File.Name
            }
        }
    }
}

# Start generating the directory tree
Get-DirectoryTree -Path $Path -ExcludeFolders $ExcludeFolders

# Add separator between directory structure and code contents
"`r`n`r`n📄 Code Contents:`r`n" | Out-File -Append -FilePath $OutputFile -Encoding UTF8

# Process code files
foreach ($File in $Global:CodeFiles) {
    # Add file header
    "`r`n$($File.Name)`:`r`n" | Out-File -Append -FilePath $OutputFile -Encoding UTF8
    
    # Add file contents
    try {
        $Content = Get-Content -Path $File.Path -Raw
        if ($Content) {
            $Content | Out-File -Append -FilePath $OutputFile -Encoding UTF8
            "`r`n" | Out-File -Append -FilePath $OutputFile -Encoding UTF8
        }
    }
    catch {
        "Error reading file: $_`r`n" | Out-File -Append -FilePath $OutputFile -Encoding UTF8
    }
}

# Show output in terminal
Get-Content $OutputFile