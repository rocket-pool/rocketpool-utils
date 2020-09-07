// Parse a boolean argument value
function parseBool(value) {
    if (value == 'true' || value == 't' || value == '1' || value == 'yes' || value == 'y') return true;
    else if (value == 'false' || value == 'f' || value == '0' || value == 'no' || value == 'n') return false;
    throw new Error('Invalid boolean value');
}


// Exports
module.exports = { parseBool };
