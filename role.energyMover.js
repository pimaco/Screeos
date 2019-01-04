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
            creep.memory.varresource = null;                
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
            if(creep.pos.roomName == ScienceEnabled && scienceLabs[9].mineralType == RESOURCE_GHODIUM_HYDRIDE && scienceLabs[9].mineralAmount >= 1500)
            {
                creep.memory.varresource = RESOURCE_GHODIUM_HYDRIDE;
            }
            
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

                var lab = creep.room.find(FIND_STRUCTURES, {
                    filter: function(object)
                    {
                        return object.structureType === STRUCTURE_LAB;
                    } });
                if(lab.length > 0)
                {
                    lab = lab[0];  
                }

                if(creep.memory.varresource == RESOURCE_GHODIUM_HYDRIDE && creep.pos.roomName == ScienceEnabled)
                {
                    creep.memory.containerSource = scienceLabs[9];
                    creep.memory.containerTarget = creep.room.terminal;
                }
                else if(creep.pos.roomName != ScienceEnabled && creep.room.storage && lab != scienceLabs[9] && lab && lab != '' && (lab.mineralCapacity - lab.mineralAmount) >= creep.carryCapacity && creep.room.terminal && creep.room.terminal.store[RESOURCE_GHODIUM_HYDRIDE] >= creep.carryCapacity && creep.room.controller.level ==  8)
                {
                    
                    creep.memory.varresource = RESOURCE_GHODIUM_HYDRIDE;
                    creep.memory.containerSource = creep.room.terminal;
                    creep.memory.containerTarget = lab;
                }
                else if(creep.pos.roomName != ScienceEnabled && creep.room.storage && lab != scienceLabs[9] && lab && lab != '' && (lab.energyCapacity - lab.energy) >= creep.carryCapacity && creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] >= creep.carryCapacity && creep.room.controller.level ==  8)
                {
                    
                    creep.memory.varresource = RESOURCE_ENERGY;
                    creep.memory.containerSource = creep.room.storage;
                    creep.memory.containerTarget = lab;
                }
                else if(creep.pos.roomName != ScienceEnabled && creep.room.storage && totalS > 30000 && creep.room.terminal && totalEnerTerm < 50000 && creep.room.controller.level ==  8)
                {
                    creep.memory.containerSource = creep.room.storage;
                    creep.memory.containerTarget = creep.room.terminal;
                }
                else if(creep.room.storage && creep.room.terminal && totalEnerTerm > 2000 && creep.room.controller.level < 8)
                {
                    creep.memory.containerSource = creep.room.terminal;
                    creep.memory.containerTarget = creep.room.storage;
                }
                else if(creep.room.storage && totalS > creep.carryCapacity && creep.room.terminal && totalEnerTerm < 1000)
                {  
                    creep.memory.containerSource = creep.room.storage;
                    creep.memory.containerTarget = creep.room.terminal;
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