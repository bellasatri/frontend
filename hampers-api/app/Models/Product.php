<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'category_id', 'name', 'price', 'stock',
        'rating', 'sold', 'description', 'img',
    ];

    protected $appends = ['img_url'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function getImgUrlAttribute()
    {
        if (!$this->img || !preg_match('/\.(jpg|jpeg|png|webp|gif)$/i', $this->img)) {
            return null;
        }
        return asset('storage/' . $this->img);
    }
}