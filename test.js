const bcrypt = require('bcryptjs'); // Importación correcta

const generarHash = async () => {
    const hash = await bcrypt.hash('12345', 10); // Genera el hash con un salt de 10 rondas
    console.log('Hash para admin123:', hash);
};

generarHash();


 