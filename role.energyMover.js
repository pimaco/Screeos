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
            if(creep.room.storage)
            {
                var links = creep.room.storage.pos.findClosestByRange(FIND_STRUCTURES,{filter: function(object) 
                {
                    return object.structureType === STRUCTURE_LINK
                 }});
                // console.log(links);
            }
            else
            {
                 var links = creep.pos.findClosestByPath(FIND_STRUCTURES,{filter: function(object) 
                {
                    return object.structureType === STRUCTURE_LINK
                 }});
            }
            
            var labs =   creep.room.find(FIND_STRUCTURES,{filter: function(object) 
                {
                    return object.structureType === STRUCTURE_LAB
                 }});  
            if(creep.memory.varresource == null || creep.memory.varresource == undefined)
            {
                creep.memory.varresource = RESOURCE_ENERGY;
            }  

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
            if(containers.length > 0 || links)
            {   
                if(creep.memory.varresource == RESOURCE_ENERGY)
                {
                    creep.room.find(FIND_DROPPED_RESOURCES,{filter: function(object){ return object.resourceType == RESOURCE_ENERGY}}).forEach(function(res) {
                        //var creep = res.findClosestCarrier();
                        creep.pickup(res);
                    });
                }
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
                        if(links)
                        {
                            var totalLink = links.energy;
            
                            if(totalLink >= 200)
                            {
                                creep.memory.containerSource = links;
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

                if(creep.room.storage && totalS > 30000 && creep.room.terminal && totalEnerTerm < 50000 && creep.room.controller.level ==  8)
                {
                    creep.memory.containerSource = creep.room.storage;
                    creep.memory.containerTarget = creep.room.terminal;
                }
                else if(creep.room.storage && creep.room.terminal && totalEnerTerm > 1000 && creep.room.controller.level < 8)
                {
                    creep.memory.containerSource = creep.room.terminal;
                    creep.memory.containerTarget = creep.room.storage;
                }
                else if(creep.room.storage)
                {  
                    if(labs && labs.length > 0 && creep.room.terminal)
                    {
                        
                        for (var i = 0, len = labs.length; i < len; i++)
                        {        
                            if(labs[i].energy < 2000)
                            {
                                //console.log(creep.name + "  "+ labs[i]);
                                creep.memory.containerSource = creep.room.storage;
                                creep.memory.containerTarget = labs[i];
                                break;
                            }
                        }

                        if(creep.carry.energy > 0 && (creep.memory.containerTarget == null || creep.memory.containerTarget == creep.room.storage))
                        {
                             creep.memory.containerTarget = creep.room.storage;
                        }
                        else if (!creep.carry.energy || creep.carry.energy == 0)
                        {
                            if(labs[0] && (labs[0].mineralType == RESOURCE_UTRIUM || labs[0].mineralType == undefined) && labs[0].mineralAmount < (labs[0].mineralCapacity - creep.carryCapacity) && creep.room.terminal.store[RESOURCE_UTRIUM] > 0)
                            {
                                creep.memory.varresource = RESOURCE_UTRIUM;
                                creep.memory.containerSource = creep.room.terminal;
                                creep.memory.containerTarget = labs[0];
                            }
                            else if(labs[2] && (labs[2].mineralType == RESOURCE_HYDROGEN || labs[2].mineralType == undefined) && labs[2].mineralAmount < (labs[2].mineralCapacity - creep.carryCapacity)&& creep.room.terminal.store[RESOURCE_HYDROGEN] > 0)
                            {
                                creep.memory.varresource = RESOURCE_HYDROGEN;
                                creep.memory.containerSource = creep.room.terminal;
                                creep.memory.containerTarget = labs[2];
                            }
                            else if(labs.length < 6 && labs[1] && (labs[1].mineralType == RESOURCE_UTRIUM_HYDRIDE) && labs[1].mineralAmount >= creep.carryCapacity)
                            {
                                creep.memory.varresource = RESOURCE_UTRIUM_HYDRIDE;
                                creep.memory.containerSource = labs[1];
                                creep.memory.containerTarget = creep.room.terminal;
                            }
                            else if(labs[3] && (labs[3].mineralType == RESOURCE_OXYGEN || labs[3].mineralType == undefined) && labs[3].mineralAmount < (labs[3].mineralCapacity - creep.carryCapacity)&& creep.room.terminal.store[RESOURCE_OXYGEN] > 0)
                            {
                                creep.memory.varresource = RESOURCE_OXYGEN;
                                creep.memory.containerSource = creep.room.terminal;
                                creep.memory.containerTarget = labs[3];
                            }
                            else if(labs.length == 6 && labs[4] && (labs[4].mineralType == RESOURCE_UTRIUM_ACID) && labs[4].mineralAmount >= creep.carryCapacity)
                            {
                                creep.memory.varresource = RESOURCE_UTRIUM_ACID;
                                creep.memory.containerSource = labs[4];
                                creep.memory.containerTarget = creep.room.terminal;
                            }                            
                            else
                            {
                                creep.memory.varresource = RESOURCE_ENERGY;
                            }
                        }    
                            
                    }
                    if(!creep.memory.containerTarget)
                    {              
                        creep.memory.containerTarget = creep.room.storage;
                    }
                }

                


                if( _.sum(creep.carry) < creep.carryCapacity && creep.memory.containerSource )
                {
                    var source = Game.getObjectById(creep.memory.containerSource.id);
                    if(creep.memory.varresource == RESOURCE_ENERGY)
                    {
                        creep.room.find(FIND_DROPPED_RESOURCES,{filter: function(object){ return object.resourceType == RESOURCE_ENERGY}}).forEach(function(res) {
                        //var creep = res.findClosestCarrier();
                        creep.pickup(res);
                        });
                    }
                    if(creep.withdraw(source, creep.memory.varresource) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(source);   
                    }
                    else
                    {
                        creep.withdraw(source, creep.memory.varresource);   
                        creep.memory.containerSource = null; 
                    }
                    //console.log('collect');
                }
                else if(creep.memory.containerTarget ) 
                {   
                   // console.log(creep.name + 'go to target');
                    
                    var target = Game.getObjectById(creep.memory.containerTarget.id);
                    //console.log(creep.name);
                    //console.log(creep.transfer(target, _.findKey(creep.carry)));
                    if(creep.transfer(target, _.findKey(creep.carry)) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(target);                  
                    }
                    else
                    {
                        //console.log(creep.name + " " + creep.memory.containerTarget);
                        creep.transfer(target, _.findKey(creep.carry));  
                        creep.memory.containerTarget = null;
                    }
                }
                else if(creep.carry.energy)
                {
                    creep.memory.containerTarget = creep.room.storage;
                }
                else if( _.sum(creep.carry))
                {
                    creep.memory.containerTarget = creep.room.terminal;
                }  
            }
        }  
        //console.log(creep.name + "  "+ creep.memory.varresource);       
    }
};
module.exports = roleEnergyMover;