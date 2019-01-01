var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) 
    {
        creep.room.find(FIND_DROPPED_RESOURCES,{filter: function(object){ return object.resourceType == RESOURCE_ENERGY}}).forEach(function(res) {
            //var creep = res.findClosestCarrier();
            creep.pickup(res);
        });

	    if(creep.memory.building && creep.carry.energy == 0) 
	    {
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) 
	    {
	        creep.memory.building = true;
        }
        
        if(creep.pos.roomName != creep.memory.home.name)
        {
            creep.travelTo(Game.rooms[creep.memory.home.name].controller);
        }
        else
        {
            var sources = creep.room.find(FIND_SOURCES);
            if(!creep.memory.sourceToHarvest || creep.memory.sourceToHarvest == null)
            {
                if(sources.length > 1)
                {
                    var path1 =  creep.pos.findPathTo(sources[0], {maxOps: 1200});
                    var path0 =  creep.pos.findPathTo(sources[1], {maxOps: 1200});

                    if(path0.length < path1.length && sources[0].energy > 0)
                    {
                        creep.memory.sourceToHarvest = sources[0];
                    }
                    else if(sources[1].energy > 0)
                    {
                        creep.memory.sourceToHarvest = sources[1];
                    }
                    else
                    {
                        creep.memory.sourceToHarvest = sources[0];
                    }
                }
                else
                {
                    creep.memory.sourceToHarvest = sources[0];
                }
            }

            if(creep.memory.building) 
            {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if(targets.length) 
                {
                    goodtarget = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                    //console.log('Creep: ' + creep + 'going to build ' + goodtarget);
                    if(creep.build(goodtarget) == ERR_NOT_IN_RANGE) 
                    {
                        creep.travelTo(goodtarget);
                    }
                }
                else
                {
                    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) 
                    {
                        creep.travelTo(creep.room.controller);
                    }
                }
            }
            else
            {
            /* if(_.sum(creep.room.storage.store) > 4000 && (creep.room.storage.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE))
                {
                    creep.travelTo(creep.room.storage);
                }*/
                if(creep.room.storage)
                {
                    var total = (creep.room.storage.store[RESOURCE_ENERGY] );
                }
                else
                {
                    var total = 0;
                }
                var containers = creep.room.find(FIND_STRUCTURES, {
                    filter: function(object)
                    {
                        return object.structureType === STRUCTURE_CONTAINER;
                    } });
                // console.log(containers);
                var containerNear = creep.pos.findInRange(FIND_STRUCTURES, 10, { filter: function(object)
                    {
                        return object.structureType === STRUCTURE_CONTAINER && object.store[RESOURCE_ENERGY] > 0;
                } });
                //console.log(containerNear);
                
                if(containerNear.length > 0 )
                {
                    if(creep.withdraw(containerNear[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        creep.travelTo(containerNear[0]);
                    }
                }
                else if(creep.room.storage && total >= 100)
                {
                    if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                    creep.travelTo(creep.room.storage);
                    }
                }   
                else if(containers.length > 0)
                {    
                    for (var i = 0, len = containers.length; i < len; i++)
                    {        
                        var total = _.sum(containers[i].store);
                        
                        if(creep.withdraw(containers[i], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE && (total > 50) ) 
                        {
                            creep.travelTo(containers[i]);
                        }
                        else
                        {
                            if(creep.harvest(Game.getObjectById(creep.memory.sourceToHarvest.id)) == ERR_NOT_IN_RANGE) 
                            {
                               creep.travelTo(Game.getObjectById(creep.memory.sourceToHarvest.id));
                            } 
                        }
                    }
                }    
                else
                {
                    if(creep.harvest(Game.getObjectById(creep.memory.sourceToHarvest.id)) == ERR_NOT_IN_RANGE) 
                    {
                       creep.travelTo(Game.getObjectById(creep.memory.sourceToHarvest.id),{offRoad: true});
                    } 
                }
            }
        }
	}
};

module.exports = roleBuilder;