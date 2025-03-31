const bcrypt = require('bcryptjs'); // Importación correcta

const generarHash = async () => {
    const hash = await bcrypt.hash(password); // Genera el hash con un salt de 10 rondas
    
};

generarHash();


 