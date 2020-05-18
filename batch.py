import sys
import os
import subprocess
import shutil

imgDir = '../ISAC/imgs/'
outDir = '../ISAC/tours/'

if not os.path.exists(outDir):
    print('Output directory does not exist, making: ' + outDir + '\n')
    os.mkdir(outDir)

if len(os.listdir(outDir)):
    print('Output directory is not empty, cleaning: ' + outDir + '\n')
    shutil.rmtree(outDir)    

if sys.platform == 'win32':
    exe_path = './builds/cli/ginger.exe'
elif sys.platform == 'darwin':
    exe_path = './builds/cli/ginger'
else:
    print('Unsupported OS, exiting.')
    sys.exit(2)


for dirName, _, _ in os.walk(imgDir):
    name = dirName.split('/')[-1]
    args = [exe_path, '-p=' + dirName, '-t=' + name, '-o=' + outDir]
    if name != '':
        print('Processing: ' + name)
        if name in [
            'Foellinger Auditorium', 
            'Loomis 151', 
            'Lincoln Hall Theater', 
            'Siebel Center 1404', 
            'National Soybean 149',
            'Temple-Buell Hall 134',
            'David Kinley Hall 114',
            'Natural History 2079',
            'MSEB 100',
            'Noyes Laboratory 100'
            ]:
            args.append('-r')
            
        subprocess.run(args)