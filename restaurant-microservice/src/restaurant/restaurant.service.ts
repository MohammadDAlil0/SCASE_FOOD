import { Inject, Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { DataBaseService } from 'src/database/database.service';
import { InjectModel } from '@nestjs/sequelize';
import { Restaurant } from 'src/models/restaurant.mode';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant) private readonly RestaurantModel: typeof Restaurant,
    @Inject() private readonly dataBaseService: DataBaseService,
  ) {}


  async create(createRestaurantDto: CreateRestaurantDto) {
    return await this.RestaurantModel.create<Restaurant>({
      ...createRestaurantDto
    });
  }

  async findAll() {
    return await this.RestaurantModel.findAll({});
  }

  async findOne(id: string) {
    return await this.dataBaseService.findByPkOrThrow(this.RestaurantModel, id);
  }

  async update(updateRestaurantDto: UpdateRestaurantDto) {
      const restaurant: Restaurant = await this.dataBaseService.findByPkOrThrow(this.RestaurantModel, updateRestaurantDto.id);
      Object.assign(restaurant, updateRestaurantDto);
      await restaurant.save();
      return restaurant;

  }

  remove(id: string) {
    return this.dataBaseService.destroyOrThrow(this.RestaurantModel, {
      where: {
        id
      }
    })
  }
}
