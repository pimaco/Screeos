// This role will move Energy and power to Power Spawn
var rolePowerHelper = {
    
    /** @param {Creep} creep **/
    run: function(creep) 
    {
        

        if(creep.pos.roomName != creep.memory.home.name)
        {
            creep.moveTo(Game.rooms[creep.memory.home.name].controller);
        }
        else
        {    
            var powerSpawn1 = Game.getObjectById('5d057877600d0416f43beda3');
            creep.memory.varresource = null;                
            if(creep.pos.roomName == 'W65N28' && creep.room.terminal && creep.room.terminal.store[RESOURCE_POWER] >= 100  && powerSpawn1.power == 0)
            {
                creep.memory.varresource = RESOURCE_POWER;
            }
            else if(creep.pos.roomName == 'W65N28' && (Game.getObjectById('5b3459874eea255aae365961').store[RESOURCE_ENERGY] >= 5000 || creep.room.terminal.store[RESOURCE_ENERGY] > 2000 ) && powerSpawn1.energy < powerSpawn1.energyCapacity)
            {
                creep.memory.varresource = RESOURCE_ENERGY; 
            }
            

            if(creep.room.terminal)
            {
                var totalEnerTerm = (creep.room.terminal.store[RESOURCE_ENERGY] );
            }
            else
            {
                var totalEnerTerm = 0;
            }

            //console.log(creep.pos.x);
            if( creep.memory.varresource == RESOURCE_POWER)
            {
                creep.memory.containerSource = creep.room.terminal;//Game.getObjectById('5ac377117c872c5b781f26b4');
            }
            else if( creep.memory.varresource == RESOURCE_ENERGY)
            {
                if(Game.getObjectById('5b3459874eea255aae365961').store[RESOURCE_ENERGY] >= 5000)
                {
                    creep.memory.containerSource = Game.getObjectById('5b3459874eea255aae365961');
                }
                else if(creep.room.terminal.store[RESOURCE_ENERGY] > 2000 )
                {
                    creep.memory.containerSource = creep.room.terminal;
                }
                
            }
            
            creep.memory.containerTarget = powerSpawn1;

                if( _.sum(creep.carry) < creep.carryCapacity && creep.memory.containerSource )
                {
                    var source = Game.getObjectById(creep.memory.containerSource.id);
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
                else if(creep.memory.containerTarget) 
                {   
                    if(creep.memory.varresource == RESOURCE_ENERGY)
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
                    else if(creep.memory.varresource == RESOURCE_POWER)
                    {
                        var target = Game.getObjectById(creep.memory.containerTarget.id);
                        if(target.power > 0)
                        {
                            creep.memory.containerTarget = creep.room.terminal;
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
                        else
                        {
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
                    }
                }
                else if( _.sum(creep.carry))
                {
                    creep.memory.containerTarget = creep.room.terminal;
                }  
            }
        }  
        //console.log(creep.name + "  "+ creep.memory.varresource);       
};
module.exports = rolePowerHelper;