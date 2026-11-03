<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class HampersSeeder extends Seeder
{
    public function run(): void
    {
        $cat = [];
        foreach (['Ulang Tahun', 'Anniversary', 'Wisuda', 'Pernikahan', 'Baby Born', 'Lebaran'] as $name) {
            $cat[$name] = Category::create(['name' => $name])->id;
        }

        $items = [
            ['Ulang Tahun', 'Sweet Candle Box',   285000, 12, '🕯️'],
            ['Ulang Tahun', 'Birthday Bliss',     350000, 8,  '🎂'],
            ['Anniversary', 'Golden Years',       520000, 5,  '🥂'],
            ['Anniversary', 'Our Story Box',      450000, 0,  '💌'],
            ['Wisuda',      'Cum Laude',          390000, 10, '🎓'],
            ['Pernikahan',  'Happily Ever After', 780000, 3,  '💍'],
            ['Baby Born',   'Welcome Little One', 420000, 7,  '🧸'],
            ['Lebaran',     'Berkah Ramadan',     495000, 15, '🌙'],
        ];

        foreach ($items as [$c, $name, $price, $stock, $icon]) {
            Product::create([
                'category_id' => $cat[$c],
                'name' => $name,
                'price' => $price,
                'stock' => $stock,
                'img' => $icon,
            ]);
        }
    }
}