<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    private function rules(): array
    {
        return [
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'price' => 'required|integer|min:0',
            'stock' => 'required|integer|min:0',
            'rating' => 'nullable|numeric|min:0|max:5',
            'description' => 'nullable|string',
            'img' => 'nullable|image|max:2048',
        ];
    }

    public function index(Request $request)
    {
        $q = Product::with('category')->latest('id');

        if ($request->filled('category_id')) {
            $q->where('category_id', $request->category_id);
        }
        if ($request->filled('keyword')) {
            $q->where('name', 'like', '%' . $request->keyword . '%');
        }

        return ['data' => $q->paginate($request->get('limit', 10))];
    }

    public function show(Product $product)
    {
        return ['data' => $product->load('category')];
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules());

        if ($request->hasFile('img')) {
            $data['img'] = $request->file('img')->store('products', 'public');
        }

        return response(['data' => Product::create($data)->load('category')], 201);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate($this->rules());

        if ($request->hasFile('img')) {
            $data['img'] = $request->file('img')->store('products', 'public');
        } else {
            unset($data['img']);
        }

        $product->update($data);

        return ['data' => $product->load('category')];
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->noContent();
    }
}