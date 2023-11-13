import express from "express";
import fs from 'fs'
import joi from 'joi';

const app = express();
const port = 3000;
const database = './database/db.json'
const data = JSON.parse(fs.readFileSync(database));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const handleServerError = (res) => {
    return res.status(500).json({ message: 'Internal Server Error' })
}

const handleClientError = (res, status, message) => {
    return res.status(status).json({ message });
}

//handle untuk get selutuh data todo
app.get("/all", (req, res) => {
    try {
        res.send(data);
        res.status(200);
      } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

//handle untuk get seluruh data berdasarkan prioritas todolist
app.get("/all/:priority", (req, res) => {
    try{
        // console.log(req.params)
        const { priority }= req.params
        const listPriority= ["high", "medium", "low"]
        if(!listPriority.includes(priority)){
            return handleClientError(res, 404, 'URL Not Found')
        }
        return res.status(200).json({ data: data.data[priority], status: 'Success'})
    }catch(error){
        return handleServerError(res)
    }
})

//handle untuk pagination
app.get("/pagination/:priority", (req, res) => {
    try {
        const { priority } = req.params;
        const { page, limit } = req.query;
        console.log(page)
        const listPriority = ["high", "medium", "low"];

        if (!listPriority.includes(priority)) {
            return handleClientError(res, 404, 'URL Not Found');
        }

        // Konversi page dan limit menjadi angka
        const pageNumber = parseInt(page, 10) || 1;
        const itemsPerPage = parseInt(limit, 10) || 10;

        // Hitung indeks awal dan akhir untuk data yang akan ditampilkan
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = pageNumber * itemsPerPage;

        const dataToDisplay = data.data[priority].slice(startIndex, endIndex);

        return res.status(200).json({ data: dataToDisplay, status: 'Success' });
    } catch (error) {
        return handleServerError(res);
    }
});


//handle untuk get data berdasarkan title
app.get("/all/:priority/:title", (req, res) => {
    try{
        const { priority, title} = req.params;
        const listPriority= ["high", "medium", "low"]


        if (!listPriority.includes(priority)) {
            return handleClientError(res, 404, 'URL Not Found');
        }
        // Mencari data dengan judul yang mengandung searchTerm
        const filteredData = data.data[priority].filter((el) => {
            const lowercaseTitle = el.title.toLowerCase();
            return lowercaseTitle.includes(title.toLowerCase());
        });


        if (filteredData.length === 0) {
            return handleClientError(res, 404, 'No Matching Data Found');
        }

        res.status(200).json({ data: filteredData, message: 'Success' });
    }catch(error){
        return handleServerError(res);
    }
})

app.post('/create/:priority', (req, res) => {
    try{
        const { priority } = req.params
        const newData = req.body;
        const listPriority= ["high", "medium", "low"]


        if (!listPriority.includes(priority)) {
            return handleClientError(res, 404, 'URL Not Found');
        }

        const scheme = joi.object({
            title: joi.string().min(5).required(),
            description: joi.string().required(),
            status: joi.string().custom((value, helpers) => {
                // Mengonversi status menjadi lowercase sebelum validasi
                const lowercasedStatus = value.toLowerCase();
        
                if (lowercasedStatus === 'todo' || lowercasedStatus === 'done' || lowercasedStatus === 'progress') {
                    return lowercasedStatus;
                } else {
                    return helpers.message('Invalid status value');
                }
            }).required()
        })
       

        const { error } = scheme.validate(newData)
        
        if( error ){
            res.status(400).json({ status: 'Validation Failed', message: error.details[0].message})
            return; //menghentikan eksekusi jika validasi gagal
        }


        if (!data.data[priority]) {
            // Pastikan prioritas yang diminta ada dalam data Anda
            return handleClientError(res, 400, "Invalid Priority");
        }

        if (data.data[priority].find((el) => el.title.toLowerCase() === newData.title.toLowerCase())) {
            return handleClientError(res, 400, 'Data Already Existed');
        }

        // Mengonversi status menjadi lowercase sebelum menyimpannya
        newData.status = newData.status.toLowerCase() || "todo";

        data.data[priority].push(newData)

        fs.writeFileSync(database, JSON.stringify(data))

        return res.status(201).json({ data: data.data[priority], status: 'Success'})
    }catch(error){
        return handleServerError(res);
    }
})

app.put('/all/:priority/:name', (req, res) => {
    try{
        const { priority, name } = req.params
        const newData = req.body
        const listPriority= ["high", "medium", "low"]


        if (!listPriority.includes(priority)) {
            return handleClientError(res, 404, 'URL Not Found');
        }

        const scheme = joi.object({
            title: joi.string().min(5),
            status: joi.string().custom((value, helpers) => {
                // Mengonversi status menjadi lowercase sebelum validasi
                const lowercasedStatus = value.toLowerCase();
        
                if (lowercasedStatus === 'todo' || lowercasedStatus === 'done' || lowercasedStatus === 'progress') {
                    return lowercasedStatus;
                } else {
                    return helpers.message('Invalid status value');
                }
            }).required(),
            description: joi.string()
        })

        const { error } = scheme.validate(newData)
        
        if( error ){
            res.status(400).json({ status: 'Validation Failed', message: error.details[0].message})
            return;
        }

        // Mencari data berdasarkan judul tanpa memperhatikan spasi
        const formattedTitle = name.replace(/\s/g, '').toLowerCase();
        // console.log(formattedTitle)
        const foundDataIndex = data.data[priority].findIndex((el) => el.title.toLowerCase().replace(/\s/g, '') === formattedTitle);
        // console.log(foundDataIndex)

        if (foundDataIndex === -1) {
            return handleClientError(res, 404, 'Data Not Found');
        }

         // Memperbarui data dengan data baru
         const existingData = data.data[priority][foundDataIndex];
        //  console.log(existingData)
         const updatedData = {
            title: newData.title || existingData.title,
            status: newData.status ? newData.status.toLowerCase() : existingData.status.toLowerCase(),
            description: newData.description || existingData.description
        };


        data.data[priority][foundDataIndex] = updatedData;

        fs.writeFileSync(database, JSON.stringify(data));
      
        return res.status(200).json({ data: data.data[priority], message: 'Success' })

    }catch(error){
        return handleServerError(res);
    }
})

app.delete('/:priority/:title', (req, res) => {
    try{
        const { priority, title } = req.params;
        const formattedTitle = title.replace(/\s/g, '').toLowerCase();
        const listPriority= ["high", "medium", "low"]


        if (!listPriority.includes(priority)) {
            return handleClientError(res, 404, 'URL Not Found');
        }

        // console.log(data.data[priority])
        const foundIndex = data.data[priority].findIndex((el) => el.title.toLowerCase().replace(/\s/g, '') === formattedTitle);

        if (foundIndex === -1) {
            return res.status(404).json({ status: 'Data Not Found', message: 'Data tidak ditemukan' });
        }

        const filtered = data.data[priority].filter((el) => el.title.toLowerCase() !== title.toLowerCase())
        data.data[priority] = filtered
        fs.writeFileSync(database, JSON.stringify(data))

        return res.status(200).json({data: data.data[priority], message: 'Success'})
        
    }catch( error){
        return handleServerError(res)
    }
})

app.post("/add-to-favorite/:priority/:title", (req, res) => {
    try {
        const { priority, title } = req.params;
        const listPriority= ["high", "medium", "low"]


        if (!listPriority.includes(priority)) {
            return handleClientError(res, 404, 'URL Not Found');
        }
        const formattedTitle = title.replace(/\s/g, '');
        const foundItem = data.data[priority].find((item) => item.title.toLowerCase().replace(/\s/g, '') === formattedTitle.toLowerCase());
        // console.log(foundItem)

        if (!foundItem) {
            return handleClientError(res, 404, "Item Not Found");
        }

        if (!data.favorites) {
            data.favorites = []; // Buat array favorit jika belum ada
        }

        if (data.favorites.some((item) => item.title.toLowerCase().replace(/\s/g, '') === formattedTitle.toLowerCase())) {
            return handleClientError(res, 400, "Item Already in Favorites");
        }

        data.favorites.push(foundItem);

        // Simpan data favorit ke dalam db.json
        fs.writeFileSync(database, JSON.stringify(data));

        return res.status(200).json({ message: "Item Added to Favorites", favorites: data.favorites });
    } catch (error) {
        return handleServerError(res);
    }
});

app.get("/favorites", (req, res) => {
    try {
        if (!data.favorites || data.favorites.length === 0) {
            return res.status(404).json({ message: "No Favorites Found" });
        }

        return res.status(200).json({ favorites: data.favorites });
    } catch (error) {
        return handleServerError(res);
    }
});

// Handle untuk menghapus data dari favorites
app.delete("/favorites/delete/:title", (req, res) => {
    try {
        const { title } = req.params;
        console.log(title)

        if (!data.favorites || data.favorites.length === 0) {
            return res.status(404).json({ message: "No Favorites Found" });
        }

        const formattedTitle = title.replace(/\s/g, '').toLowerCase();
        // console.log(formattedTitle)
        const indexToRemove = data.favorites.findIndex((item) => item.title.toLowerCase().replace(/\s/g, '') === formattedTitle);
        // console.log(indexToRemove)

        if (indexToRemove === -1) {
            return res.status(404).json({ message: "Item Not Found in Favorites" });
        }

        // Hapus item dari favorites
        data.favorites.splice(indexToRemove, 1);

        // Simpan perubahan ke dalam db.json
        fs.writeFileSync(database, JSON.stringify(data));

        return res.status(200).json({ message: "Item Removed from Favorites", favorites: data.favorites });
    } catch (error) {
        return handleServerError(res);
    }
});




app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});
  