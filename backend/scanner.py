import json
import sys
import subprocess
from pathlib import Path


    """
    {
        "Title": 
        "size": 
        "filetype": 
        "length":
    }
    """
def get_duration(filename):
    #runs ffprobe to get the length of video file in seconds
    duration = subprocess.run(["ffprobe", "-v", "error", "-show_entries",
                             "format=duration", "-of",
                             "default=noprint_wrappers=1:nokey=1", filename],
                            stdout=subprocess.PIPE,
                            stderr=subprocess.STDOUT)
    return float(duration.stdout)
    """
    {
    "Directory": ,
        "Files": 
        [
            {
            "Title": 
            "size": 
            "filetype": 
            "length":
            }
            {
            "Title": 
            "size": 
            "filetype": 
            "length":
            }
        ]
    }
    """
def get_file_list(directory, output_filename = "video_list.json" ):
    path = Path(directory)
    path_details= []
    root_details= []
    output_data= []
    
    # Collect file data on all files directly in root folder
    for file in path.iterdir():
        if file.is_file():
            file_details = get_file_details(file)
            root_details.append(file_details)
            
    # If there are any unorganized files in root folder, add them to json        
    if root_details:
        output_data.append({
            "Directory": "root",
            "Files": root_details
        })
            
    # Collect file data from all subdirectories from root
    for directory in path.iterdir():
        if directory.is_dir():
            
            #rglob searches Path objects recursively for a specified pattern
            for file in directory.rglob("*"):
                if file.is_file():
                    details = get_file_details(file)
                    path_details.append(details)
            output_data.append({
                "Directory": directory.name,
                "Files": path_details
            })
            
            
 
    with open(output_filename, "w") as f:
        json.dump(output_data, f, indent=2)
        
    print(f"Exported details for {len(output_data)} files to {output_filename}")
    
    f.close()
    
    
def get_file_details(file):
    details = {
                "Title": file.stem,     # Filename without extension
                "size": file.stat().st_size, # file size in bytes
                "filetype": file.suffix.lower(), # file extension
                
                "length": get_duration(file)    # get video durationn in seconds
            }
     
    return details
    