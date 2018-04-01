var roleLinker = {

    /** @param {Creep} creep **/
    run: function(creep) 
    {
        var SR = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function(object)
            {
                return object.structureType === STRUCTURE_LINK;
            } 
        });
        var total = _.sum(creep.carry);
	    if(total < creep.carryCapacity) 
	    {
	       if(SR.transferEnergy(creep) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(SR);
            }
        }
        else if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE || creep.transfer(creep.room.storage, RESOURCE_LEMERGIUM) == ERR_NOT_IN_RANGE) 
        {
	        creep.moveTo(creep.room.storage);  
	        creep.transfer(creep.room.storage, RESOURCE_ENERGY);
	        creep.transfer(creep.room.storage, RESOURCE_LEMERGIUM);
        }
        
        if(creep.pos.roomName == 'E26N21')
        {
            
            
            var Term1 = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function(object)
            {
                return object.structureType === STRUCTURE_TERMINAL;
            } 
            });
            if(creep.room.storage.store[RESOURCE_LEMERGIUM] > 250)
            {
                var total = _.sum(creep.carry);
                if((total < creep.carryCapacity && (creep.room.storage.transfer(creep, RESOURCE_LEMERGIUM) == ERR_NOT_IN_RANGE))) 
                {
                    creep.moveTo(creep.room.storage);
                    
                    creep.room.storage.transfer(creep, RESOURCE_LEMERGIUM);
                }
                else if (creep.transfer(Term1, RESOURCE_LEMERGIUM) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(Term1);
                }
            }
            else if(creep.room.storage.store[RESOURCE_ENERGY] > 450000)
            {
                if((creep.carry.energy < creep.carryCapacity && (creep.room.storage.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)) || (creep.carry.energy == 0))
                {
                    creep.moveTo(creep.room.storage);
                    
                    creep.room.storage.transfer(creep, RESOURCE_ENERGY);
                }
                else if (creep.transfer(Term1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(Term1);
                }
            }
            
        }
        else if((creep.pos.roomName == 'E27N21') && (_.sum(creep.room.storage.store) < 900000))
        {
            var Term2 = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function(object)
            {
                return object.structureType === STRUCTURE_TERMINAL;
            } 
            });
            
    	    
            if(_.sum(Term2) > 0 && (Term2.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE || Term2.transfer(creep, RESOURCE_LEMERGIUM) == ERR_NOT_IN_RANGE)  && total < creep.carryCapacity)
            {
                creep.moveTo(Term2);
                Term2.transfer(creep, RESOURCE_LEMERGIUM);
                Term2.transfer(creep, RESOURCE_ENERGY);
                
            }
            
        }
       
        
        
	}
};
module.exports = roleLinker;