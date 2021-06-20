<?php
header("Access-Control-Allow-Origin: *");

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->get('produk', [
    'as' => 'produk', 'uses' => 'ProdukController@index'
]);

$router->get('produk/{id}', [
    'as' => 'produk_show', 'uses' => 'ProdukController@show'
]);

$router->post('produk_add', [
    'as' => 'produk_add', 'uses' => 'ProdukController@store'
]);

$router->post('produk/update/{id}', [
    'as' => 'produk_update', 'uses' => 'ProdukController@update'
]);

$router->post('produk/delete/{id}', [
    'as' => 'produk_destroy', 'uses' => 'ProdukController@destroy'
]);

$router->get('image_path', function(){
    return storage_path('app/public');
});
