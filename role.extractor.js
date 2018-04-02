var roleExtractor = {

    /** @param {Creep} creep **/
    run: function(creep) 
    {
        if (creep.pos.roomName == 'W62N27')
        {
            var SR = creep.room.lookForAt('mineral', 8, 16)[0];
            var total = _.sum(creep.carry);
    	    if(total < creep.carryCapacity) 
    	    {
    	        //console.log('Hydrogen');
    	        creep.pos.findInRange(FIND_DROPPED_RESOURCES).forEach(function(res) {
                //var creep = res.findClosestCarrier();
                creep.pickup(res);
                });
                
               
                if(creep.harvest(SR) == ERR_NOT_IN_RANGE) 
                {
                    creep.travelTo(SR);
                }
            }
            else if(creep.transfer(creep.room.terminal, RESOURCE_UTRIUM) == ERR_NOT_IN_RANGE) 
            {
    	        creep.travelTo(creep.room.terminal);  
    	        creep.transfer(creep.room.terminal, RESOURCE_UTRIUM);
            }
    	}
    	else if (creep.pos.roomName == 'W63N28')
        {
            var SR = creep.room.lookForAt('mineral', 17, 40)[0];
            var total = _.sum(creep.carry);
    	    if(total < creep.carryCapacity) 
    	    {
    	        //console.log('Hydrogen');
    	        creep.pos.findInRange(FIND_DROPPED_RESOURCES).forEach(function(res) {
                //var creep = res.findClosestCarrier();
                creep.pickup(res);
                });
                
               
                if(creep.harvest(SR) == ERR_NOT_IN_RANGE) 
                {
                    creep.travelTo(SR);
                }
            }
            else if(creep.transfer(creep.room.terminal, RESOURCE_ZYNTHIUM) == ERR_NOT_IN_RANGE) 
            {
    	        creep.travelTo(creep.room.terminal);  
    	        creep.transfer(creep.room.terminal, RESOURCE_ZYNTHIUM);
            }
    	}
    }	
};

module.exports = roleExtractor;