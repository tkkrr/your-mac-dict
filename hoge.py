import sys, os

base = os.path.dirname(__file__)
sys.path.append(base + "/lib")
from DictionaryServices import *

def main():
    word = sys.argv[1]
    result = DCSCopyTextDefinition(None, word, (0, len(word)))
    # print( result.encode('utf-8') )
    print(result)

if __name__ == '__main__':
    main()