import { Inject, Injectable } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { InjectModel } from '@nestjs/sequelize';
import { DataBaseService } from 'src/database/database.service';
import { Food } from 'src/models/food.model';

@Injectable()
export class FoodService {
  constructor(
    @InjectModel(Food) private readonly FoodModel: typeof Food,
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

  remove(id: string) {
    return this.dataBaseService.destroyOrThrow(this.FoodModel, {
      where: {
        id
      }
    })
  }
}
