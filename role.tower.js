//No longer possible to transfer energy between structures
module.exports = function (tower) {
    //console.log('here');
    if(tower.energy > 250)  
    {
        var SR = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function(object)
            {
                return object.structureType === STRUCTURE_WALL && (object.hits < 10000 );
            } 
        });
        var SR2 = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(object)
                {
                    return object.structureType === STRUCTURE_RAMPART && (object.hits < 10000 );
                } 
                });    
        if(!SR && !SR2)
        {
            var SR = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(object)
                {
                    return object.structureType === STRUCTURE_WALL && (object.hits < 50000 );
                } 
            });
            var SR2 = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(object)
                {
                    return object.structureType === STRUCTURE_RAMPART && (object.hits < 50000 );
                } 
            }); 
        } 
        if(SR2) 
        {  
            tower.repair(SR2);
        }
        else if(SR)
        {
            tower.repair(SR);
        }   
    }
};