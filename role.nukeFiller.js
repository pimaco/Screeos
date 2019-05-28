// This role will move Energy from full containers to one with available space
var roleNukeFiller = {
    
    /** @param {Creep} creep **/
    run: function(creep) 
    {
        

        if(creep.pos.roomName != creep.memory.home.name)
        {
            creep.moveTo(Game.rooms[creep.memory.home.name].controller);
        }
        else
        {    
            
            creep.memory.varresource = null;                
            if(creep.pos.roomName == 'W62N27' && creep.room.terminal && creep.room.terminal.store[RESOURCE_GHODIUM] >= 500  && Game.getObjectById('5b1a9a14d025753871a5f213').ghodium < Game.getObjectById('5b1a9a14d025753871a5f213').ghodiumCapacity)
            {
                creep.memory.varresource = RESOURCE_GHODIUM;
            }
            else if(creep.pos.roomName == 'W62N27' && creep.room.terminal && creep.room.terminal.store[RESOURCE_ENERGY] >= 500  && Game.getObjectById('5b1a9a14d025753871a5f213').energy < Game.getObjectById('5b1a9a14d025753871a5f213').energyCapacity)
            {
                creep.memory.varresource = RESOURCE_ENERGY; 
            }
            else if((Game.getObjectById('5b1a9a14d025753871a5f213').energy >= Game.getObjectById('5b1a9a14d025753871a5f213').energyCapacity && Game.getObjectById('5b1a9a14d025753871a5f213').ghodium >= Game.getObjectById('5b1a9a14d025753871a5f213').ghodiumCapacity) || Game.getObjectById('5b1a9a14d025753871a5f213').cooldown > 0) 
            {
                creep.memory.role = 'energyMover';
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

            creep.memory.containerSource = creep.room.terminal;
            creep.memory.containerTarget = Game.getObjectById('5b1a9a14d025753871a5f213');

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
                else if( _.sum(creep.carry))
                {
                    creep.memory.containerTarget = creep.room.terminal;
                }  
            }
        }  
        //console.log(creep.name + "  "+ creep.memory.varresource);       
};
module.exports = roleNukeFiller;