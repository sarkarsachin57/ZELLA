from initials import *

# parse argument 
parser = argparse.ArgumentParser()
parser.add_argument('--data', required=True)
args = parser.parse_args()

def purge(data):
    
    mongodb[data].delete_many({})
    
    logger.info("Purged!")
    
purge(args.data)
    