<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Produk;

class ProdukController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function index(Request $request)
    {
        $data = Produk::get();

        return $data;
    }

    public function store(Request $request)
    {
        $input = $request->json()->all();
        $produk = new Produk;

        $produk->nama_barang = $input['namaBarang'];
        $produk->harga_beli = $input['hargaBeli'];
        $produk->harga_jual = $input['hargaJual'];
        $produk->stok = $input['stok'];
        $produk->created_by = 'ADMIN';

        $produk->save();
        echo 'success';
    }

    public function show($id)
    {
        return Produk::find($id);
    }

    public function update($id, Request $request)
    {
        $input = $request->json()->all();
        $produk = Produk::find($id);

        $produk->nama_barang = $input['namaBarang'];
        $produk->harga_beli = $input['hargaBeli'];
        $produk->harga_jual = $input['hargaJual'];
        $produk->stok = $input['stok'];
        $produk->updated_by = 'ADMIN';

        $produk->save();
        echo 'success';
    }

    public function destroy($id)
    {
        $produk = Produk::find($id);

        if($produk){
            return $produk->forceDelete();
        } else {
            return false;
        }
    }

    public function getBasePath()
    {
        return base_path();
    }
}
