import os
import subprocess

rootDir = 'C:/Users/rwwalla2/Desktop/ISAC/imgs/'
for dirName, _, _ in os.walk(rootDir):
    name = dirName.split('/')[-1]
    if name != '':
        if name == 'Lincoln Hall Theater':
            print('Processing: ' + name)
            args = ['./ginger.exe', '-p=' + dirName, '-t=' + name, '-r']
            subprocess.run(args)
        else: 
            print('Processing: ' + name)
            args = ['./ginger.exe', '-p=' + dirName, '-t=' + name]
            subprocess.run(args)