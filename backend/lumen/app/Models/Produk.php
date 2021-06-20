<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produk extends Model
{

    public $table = 'produk';

    public $fillable = [
        'foto_barang',
        'nama_barang',
        'harga_beli',
        'harga_jual',
        'stok',
        'created_by',
        'updated_by'
    ];

    /**
     * The attributes that should be casted to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'foto_barang' => 'string',
        'nama_barang' => 'string',
        'harga_beli' => 'integer',
        'harga_jual' => 'integer',
        'stok' => 'integer',
        'created_by' => 'string',
        'updated_by' => 'string',
    ];

    /**
     * Validation rules
     *
     * @var array
     */
    public static $rules = [
        'nama_barang' => 'required',
        'harga_beli' => 'required|integer',
        'harga_jual' => 'required|integer',
        'stok' => 'required|integer',
        'created_by' => 'required',
        'updated_by' => 'nullable',
    ];

}
