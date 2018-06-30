
module.exports = function (creep) {
        if(creep.pos.roomName != creep.memory.home.name)
        {
            creep.travelTo(Game.rooms[creep.memory.home.name].controller);
           //creep.travelTo(Game.flags.Flag4);
           //delete creep.memory.sourceToHarvest;
           //delete creep.memory.containerSource;
        }
        else
        {   
            creep.room.find(FIND_DROPPED_RESOURCES).forEach(function(res) {
                //var creep = res.findClosestCarrier();
                creep.pickup(res);
            });
            var sources = creep.room.find(FIND_SOURCES);
            
            if(!creep.memory.sourceToHarvest || creep.memory.sourceToHarvest == null)
            {
                if(sources.length > 1)
                {
                    var path0 =  creep.pos.findPathTo(sources[0], {maxOps: 1200});
                    var path1 =  creep.pos.findPathTo(sources[1], {maxOps: 1200});

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

            if(creep.room.storage)
            {
                var totalS = (creep.room.storage.store[RESOURCE_ENERGY] );
            }
            else
            {
                var totalS = 0;
            }

            if(creep.memory.upgrade && creep.carry.energy == 0) 
            {
                creep.memory.upgrade = false;
            }
            if(!creep.memory.upgrade && creep.carry.energy == creep.carryCapacity) 
            {
                creep.memory.upgrade = true;
                creep.memory.sourceToHarvest = null;
            }
    
            if(creep.memory.upgrade) 
            {

                var towers = creep.room.find(
                    FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
                if(towers[0] && towers[0].energy < towers[0].energyCapacity && creep.room.controller.ticksToDowngrade > 9000)
                {
                    creep.travelTo(towers[0]);
                    creep.transfer(towers[0], RESOURCE_ENERGY);
                }
                else if((creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE && creep.carry.energy > 0) || creep.carry.energy == creep.carryCapacity)
                {
                    creep.travelTo(creep.room.controller);
                }
            }
            else
            {
                var containers = creep.room.find(FIND_STRUCTURES, {
                    filter: function(object)
                    {
                        return object.structureType === STRUCTURE_CONTAINER;
                    } });
                   // console.log(containers);
                if(creep.room.storage && totalS >= 100)
                {
                    if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                       creep.travelTo(creep.room.storage);
                    }
                }  
                else if(containers.length > 0)
                {   
                    if(!creep.memory.containerSource)
                    {
                        creep.memory.containerSource = null
                    }
                    var total =[];
        
                    for (var i = 0, len = containers.length; i < len; i++)
                    {        
                        total[i] = _.sum(containers[i].store);
                    } 
                    
                    for (var i = 0, len = total.length; i < len; i++)
                    {
                      
                        if(total[i] >= 100 && creep.memory.containerSource == null )
                        {
                            creep.memory.containerSource = containers[i];
                        }
                        else
                        {       
                            if(creep.harvest(Game.getObjectById(creep.memory.sourceToHarvest.id)) == ERR_NOT_IN_RANGE) 
                            {
                               creep.travelTo(Game.getObjectById(creep.memory.sourceToHarvest.id));
                            } 
                        }               
                    }
        
                    if(creep.carry.energy < creep.carryCapacity && creep.memory.containerSource != null )
                    {
                        var source = Game.getObjectById(creep.memory.containerSource.id);
                        if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        {
                            creep.travelTo(source);   
                        }
                        else
                        {
                            creep.withdraw(source, RESOURCE_ENERGY);   
                            creep.memory.containerSource = null; 
                        }
                        //console.log('collect');
                    }
                    else
                    {

                        if(creep.harvest(Game.getObjectById(creep.memory.sourceToHarvest.id)) == ERR_NOT_IN_RANGE) 
                        {
                           creep.travelTo(Game.getObjectById(creep.memory.sourceToHarvest.id));
                        } 
                    }
                }
                else
                {
                    if(creep.harvest(Game.getObjectById(creep.memory.sourceToHarvest.id)) == ERR_NOT_IN_RANGE) 
                    {
                        //console.log(Game.getObjectById(creep.memory.sourceToHarvest.id).pos);
                        creep.travelTo(Game.getObjectById(creep.memory.sourceToHarvest.id).pos,{offRoad: true});
                    } 
                }
        } 
            
    }
        
}
