// This role will move Energy from full containers to one with available space
var roleEnergyMover = {
    
    /** @param {Creep} creep **/
    run: function(creep) 
    {
        

        if(creep.pos.roomName != creep.memory.home.name)
        {
            creep.moveTo(Game.rooms[creep.memory.home.name].controller);
        }
        else
        {    
            var containers = creep.room.find(FIND_STRUCTURES, {
                filter: function(object)
                {
                    return object.structureType === STRUCTURE_CONTAINER;
                } });
        
            var links = creep.room.find(FIND_STRUCTURES,{filter: function(object) 
                {
                    return object.structureType === STRUCTURE_LINK
                }});
            if(creep.room.storage)
            {
                var totalS = (creep.room.storage.store[RESOURCE_ENERGY] );
            }
            else
            {
                var totalS = 0;
            }   
            
            if(creep.room.terminal)
            {
                var totalEnerTerm = (creep.room.terminal.store[RESOURCE_ENERGY] );
            }
            else
            {
                var totalEnerTerm = 0;
            }

            if(creep.pos.roomName == 'W62N27' &&((creep.pos.x == 34 && creep.pos.y == 32) || (creep.pos.x == 34 && creep.pos.y == 33)  || (creep.pos.x == 35 && creep.pos.y == 33)|| (creep.pos.x == 35 && creep.pos.y == 34)))
            {
                creep.move(BOTTOM);
                //console.log(creep.pos);
            }
            //console.log(creep.pos.x);
            if(containers.length > 0 || links.length > 0)
            {   
                creep.room.find(FIND_DROPPED_RESOURCES).forEach(function(res) {
                    //var creep = res.findClosestCarrier();
                    creep.pickup(res);
                });
                if(!creep.memory.containerSource)
                {
                    creep.memory.containerSource = null
                }
                if(!creep.memory.containerTarget)
                {
                    creep.memory.containerTarget = null
                }
                var total =[];

                for (var i = 0, len = containers.length; i < len; i++)
                {        
                    total[i] = _.sum(containers[i].store);
                } 
                
                for (var i = 0, len = total.length; i < len; i++)
                {
                    if(!creep.room.storage)
                    {
                        if(total[i] >= 1600 && creep.memory.containerSource == null )
                        {
                            creep.memory.containerSource = containers[i];
                            //console.log('set source' + i);

                        }
                        else if(total[i] < 1200 && creep.memory.containerTarget == null && !creep.room.storage)
                        {
                            //console.log('set target' + i);
                            creep.memory.containerTarget = containers[i];
                        } 
                    }
                    else
                    {
                        if(links.length > 0)
                        {
                            var totalLink = links[0].energy;
            
                            if(totalLink >= 200)
                            {
                                creep.memory.containerSource = links[0];
                            //console.log('source is now: ' + links[0]);
                            }
                            else if(total[i] >= 400 && creep.memory.containerSource == null )
                            {
                                creep.memory.containerSource = containers[i];    
                            }
                        }
                        else if(total[i] >= 400 && creep.memory.containerSource == null )
                        {
                            creep.memory.containerSource = containers[i];
                        }
                    }                 
                }



                if(creep.room.storage && totalS > 15000 && creep.room.terminal && totalEnerTerm < 50000)
                {
                    creep.memory.containerSource = creep.room.storage;
                    creep.memory.containerTarget = creep.room.terminal;
                }
                /*else if(creep.room.storage && totalS < 150000 && creep.room.terminal && totalEnerTerm > 50000)
                {
                    creep.memory.containerSource = creep.room.terminal;
                    creep.memory.containerTarget = creep.room.storage;
                }*/
                else if(creep.room.storage)
                {                
                    creep.memory.containerTarget = creep.room.storage;
                }


                if(creep.carry.energy < creep.carryCapacity && creep.memory.containerSource )
                {
                    var source = Game.getObjectById(creep.memory.containerSource.id);
                    creep.room.find(FIND_DROPPED_RESOURCES).forEach(function(res) {
                        //var creep = res.findClosestCarrier();
                        creep.pickup(res);
                        });
                    if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(source);   
                    }
                    else
                    {
                        creep.withdraw(source, RESOURCE_ENERGY);   
                        creep.memory.containerSource = null; 
                    }
                    //console.log('collect');
                }
                else if(creep.memory.containerTarget ) 
                {   
                    //console.log('go to target');
                    var target = Game.getObjectById(creep.memory.containerTarget.id);
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(target);                  
                    }
                    else
                    {
                        creep.transfer(target, RESOURCE_ENERGY);  
                        creep.memory.containerTarget = null;
                    }
                }  
            }
        }         
    }
};
module.exports = roleEnergyMover;