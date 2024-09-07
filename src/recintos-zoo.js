class RecintosZoo {
    constructor() {
        this.recintos = [
          { numero: 1, bioma: ["savana"], tamanho: 10, animais: [{ especie: "MACACO", quantidade: 3 }] },
          { numero: 2, bioma: ["floresta"], tamanho: 5, animais: [] },
          { numero: 3, bioma: ["savana", "rio"], tamanho: 7, animais: [{ especie: "GAZELA", quantidade: 1 }] },
          { numero: 4, bioma: ["rio"], tamanho: 8, animais: [] },
          { numero: 5, bioma: ["savana"], tamanho: 9, animais: [{ especie: "LEAO", quantidade: 1 }] },
        ];
    
        this.animais = {
          LEAO: { tamanho: 3, biomas: ["savana"], carnivoro: true },
          LEOPARDO: { tamanho: 2, biomas: ["savana"], carnivoro: true },
          CROCODILO: { tamanho: 3, biomas: ["rio"], carnivoro: true },
          MACACO: { tamanho: 1, biomas: ["savana", "floresta"], carnivoro: false },
          GAZELA: { tamanho: 2, biomas: ["savana"], carnivoro: false },
          HIPOPOTAMO: { tamanho: 4, biomas: ["savana", "rio"], carnivoro: false, biomaEspecifico: "savana e rio" },
        };
    }

    analisaRecintos(especie, quantidade) {
        if (!this.animais[especie]) {
            return { erro: "Animal inválido" };
        }

        if (quantidade <= 0 || !Number.isInteger(quantidade)) {
            return { erro: "Quantidade inválida" };
        }

        const animalInfo = this.animais[especie];
        const tamanhoNecessario = animalInfo.tamanho * quantidade;
        let recintosViaveis = [];

        this.recintos.forEach(recinto => {
            let espacoOcupado = recinto.animais.reduce((total, a) => total + a.quantidade * this.animais[a.especie].tamanho, 0);
            let espacoLivre = recinto.tamanho - espacoOcupado;

            const convivioValido = this.verificaConvivio(recinto, especie, animalInfo, quantidade);

            if (recinto.animais.length > 0 && recinto.animais.some(a => a.especie !== especie)) {
                espacoLivre -= 1;
            }

            const biomaValido = this.verificaBioma(recinto.bioma, animalInfo);

            if (biomaValido && convivioValido && espacoLivre >= tamanhoNecessario) {
                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre - tamanhoNecessario} total: ${recinto.tamanho})`);
            }
        });

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        return { recintosViaveis };
    }

    verificaBioma(biomasRecinto, animalInfo) {
        return biomasRecinto.some(b => animalInfo.biomas.includes(b));
    }

    verificaConvivio(recinto, novaEspecie, animalInfo, quantidade) {
        const isCarnivoro = animalInfo.carnivoro;
        const biomaEspecifico = animalInfo.biomaEspecifico;
        const possuiCarnivoro = recinto.animais.some(a => this.animais[a.especie].carnivoro);

        if(isCarnivoro && recinto.animais.some(a => a.especie !== novaEspecie)) {
            return false;
        }
        
        if (possuiCarnivoro && recinto.animais.some(a => a.especie !== novaEspecie)) {
            return false;
        }

        if (novaEspecie === "HIPOPOTAMO" && recinto.bioma !== biomaEspecifico) {
            return false;
        }

        if (novaEspecie === "MACACO") {
            if (recinto.animais.length === 0 && quantidade < 2) {
                return false;
            }
        }

        return true;
    }

}

export { RecintosZoo as RecintosZoo };
