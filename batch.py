import os
import subprocess

rootDir = 'C:/Users/rwwalla2/Desktop/ISAC/imgs/'
for dirName, _, _ in os.walk(rootDir):
    name = dirName.split('/')[-1]
    print('Processing: ' + name)
    args = ['./ginger.exe', '-p=' + dirName, '-t=' + name]
    subprocess.run(args)
    