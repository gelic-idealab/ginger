import os
import subprocess

imgDir = '../ISAC/imgs/'
outDir = '../ISAC/tours/'

for dirName, _, _ in os.walk(imgDir):
    name = dirName.split('/')[-1]
    args = ['./ginger.exe', '-p=' + dirName, '-t=' + name, '-o=' + outDir]
    if name != '':
        if name in ['Foellinger Auditorium', 'Loomis 151']:
            print('Processing: ' + name)
            args.append('-r')
            subprocess.run(args)
        else: 
            print('Processing: ' + name)
            subprocess.run(args)