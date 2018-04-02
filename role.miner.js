var roleMiner = {
    
    /** @param {Creep} creep **/
    run: function(creep) 
    {
        if(creep.pos.roomName != creep.memory.home.name)
        {
            creep.travelTo(Game.rooms[creep.memory.home.name].controller);
        }
        else
        {
            var containers = creep.pos.findInRange(FIND_STRUCTURES, 2, 
            {filter: {structureType: STRUCTURE_CONTAINER}});
            // console.log(containers);
            //console.log(_.sum(containers[0].store));
            var links = creep.pos.findInRange(FIND_STRUCTURES, 2,{filter: function(object) 
            {
                return object.structureType === STRUCTURE_LINK
            }});
             //console.log(_.sum(links[0].store + '  '+ creep.name);
            if(creep.carry.energy < creep.carryCapacity) 
            {
                creep.room.find(FIND_DROPPED_RESOURCES).forEach(function(res) {
                //var creep = res.findClosestCarrier();
                creep.pickup(res);
                });
            
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) 
                {
                    creep.travelTo(sources[1]);
                }
            }
            else if (links.length > 0 && _.sum(links[0].store) < 800)
            {
                //else if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                if(creep.transfer(links[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.travelTo(links[0]);  
                    creep.transfer(links[0], RESOURCE_ENERGY);
                }
            }
            else if (containers.length > 1 && _.sum(containers[0].store) >= 2000)
            {
            // console.log('here');
                //else if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                if(creep.transfer(containers[1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.travelTo(containers[1]);  
                    creep.transfer(containers[1], RESOURCE_ENERGY);
                }
            }
            else 
            {
                var containersClose = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: function(object)
                    {
                        return object.structureType === STRUCTURE_CONTAINER;
                    } 
                    
                    });
                //console.log(containersClose);
                if(creep.transfer(containersClose, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.travelTo(containersClose);  
                    creep.transfer(containersClose, RESOURCE_ENERGY);
                }
                    
            }   
        }
    }
};
    
    module.exports = roleMiner;