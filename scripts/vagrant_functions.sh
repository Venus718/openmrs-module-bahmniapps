#!/bin/bash 

#####################################################################################################
# This script can be used to call functions which will execute a command in your vagrant box. 
# -c option will be used to pass a command
# -f option will be used to pass a full qualified file that contains commands
#####################################################################################################

MACHINE_IP=192.168.33.10
KEY_FILE=~/.vagrant.d/insecure_private_key
TIMEOUT="-o ConnectTimeout=5"

function run_in_vagrant {
    
    ssh vagrant@$MACHINE_IP -i $KEY_FILE $TIMEOUT "$1"

}