import  fs from 'fs';

export default class ProductManager{
    constructor(path){
        this.path = path;
    }

    
    async validateExisteFile () {
        try{
            await fs.promises.stat(this.path)
        }catch(error){
            await fs.promises.writeFile(path, JSON.stringify([]));
        }
    }     
    
    async guardarProductos (productos){
        try{        
        const data = JSON.stringify(productos, null, '\t')
        console.log(data)
        await fs.promises.writeFile(this.path, data)
        }catch(error){
            console.log("error00000")
        }
    };



    async getAll(){
        try{
            const data = await fs.promises.readFile(this.path, "utf-8")
            let analys = JSON.parse(data)
            let array_products = []

            for (let i = 0; i<analys.length; i++){
                analys[i]['id']= i
                array_products.push(analys[i])
            }
            return array_products

        }catch(error){
            console.log("Error")
        }
    }

    
    async getById (idBuscado){
        try{
           // const productos = await obtenerProductos();
            const productos = await this.getAll();
            const indice = productos.findIndex((unProducto) => unProducto.id === idBuscado );
        
            if(indice < 0) {
                throw new Error('El producto no existe');
            }
        
            return productos[indice];
        }catch(error){
            console.log("Problema con el producto solicitado")
        }
    }
    
    async save(data) {
        
        if(!data.title || !data.price || typeof data.title !== 'string' || typeof data.price !== 'number') throw new Error('Datos invalidos');
    
            //const productos = await obtenerProductos();
        try{
            const productos = await this.getAll();
            let id = 1;
    
            if(productos.length){	//Si tengo elementos en mi array
                id = productos[productos.length -1].id + 1;
            }
        
            const nuevoProducto = {
                title: data.title,
                price: data.price,
                id: id,
            };
        
            productos.push(nuevoProducto);
            await this.guardarProductos(productos);
        }catch(error){
            console.log("Problemas al guardar el producto")
        }        
    }
    
    async deleteAll(){
        try{
            await this.guardarProductos([]);
        }catch(error){
            console.log("problemas para eliminar todos los productos")
        }
        
    }
    
    async deleteById(idBuscado){
        try{
            console.log("idbuscado",idBuscado)//
            const productos = await this.getAll();
        
            const indice = productos.findIndex((unProducto) => unProducto.id === idBuscado );
            console.log(indice)//
            if(indice < 0) {
                return;
            }
        
            productos.splice(indice, 1);
        
            await this.guardarProductos(productos);
        }catch(error)
        {
            console.log("Error")
        }
    } 

}


const path = './files/Products.json'


const archivo = new ProductManager(path);


 // Llamado a getAll
    
const main = async () => {
    try{           
        let products = await archivo.getAll(); 
        console.log(products);

// llamando getById
        const producto = await archivo.getById(2);
        if (producto != null) {
            console.log(producto);
        } 

//llamando save

        const nuevoProducto = { title: "Remera", price: 20 };
        await archivo.save(nuevoProducto);
        products = await archivo.getAll();
        console.log(products);

//llamando deleteById
        try {
            await archivo.deleteById(4);
            products = await archivo.getAll();
            console.log(products);
        } catch (error) {
            console.log(error);
        } 
//llamando deleteAll
        await archivo.deleteAll();
        products = await archivo.getAll();
        console.log(products);
    } catch (error) {
        console.log("Problemas!!!", error);
        }
};

main();