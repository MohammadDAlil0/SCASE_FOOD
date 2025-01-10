import { Inject, Injectable } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { InjectModel } from '@nestjs/sequelize';
import { AddFoodDto } from './dto/add-food.dto';
import { Food } from 'src/models/food.model';
import { foodOrder } from 'src/models/food-order.model';
import { DataBaseService } from 'src/core/database/database.service';

@Injectable()
export class FoodService {
  constructor(
    @InjectModel(Food) private readonly FoodModel: typeof Food,
    @InjectModel(foodOrder) private readonly FoodOrderModel: typeof foodOrder,
    @Inject() private readonly dataBaseService: DataBaseService,
  ) {}


  async create(createFoodDto: CreateFoodDto) {
    return await this.FoodModel.create<Food>({
      ...createFoodDto
    });
  }

  async findAll() {
    return await this.FoodModel.findAll({});
  }

  async findOne(id: string) {
    return await this.dataBaseService.findByPkOrThrow(this.FoodModel, id);
  }

  async update(updateFoodDto: UpdateFoodDto) {
      const restaurant: Food = await this.dataBaseService.findByPkOrThrow(this.FoodModel, updateFoodDto.id);
      Object.assign(restaurant, updateFoodDto);
      await restaurant.save();
      return restaurant;

  }

  async remove(id: string) {
    return await this.dataBaseService.destroyOrThrow(this.FoodModel, {
      where: {
        id
      }
    })
  }

  async addFoodToOrder(addFoodDto: AddFoodDto) {
    const food: Food = await this.dataBaseService.findByPkOrThrow(this.FoodModel, addFoodDto.foodId);
    return await this.FoodOrderModel.create({
      ...addFoodDto,
      price: addFoodDto.number * food.price
    })
  }

  async removeFoodFromOrder(id: string) {
    await this.dataBaseService.destroyOrThrow(this.FoodOrderModel, id);
  }

  async getFoodOfOrder(id: string) {
    const foods = this.FoodOrderModel.findAll<foodOrder>({
      where: {
        orderId: id,
      },
      include: [
        {
          model: Food,
          as: 'food',
        }
      ]
    });
    console.log(foods);
    return foods;
  }
}
