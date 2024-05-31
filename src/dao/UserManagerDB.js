import { userModel } from "./models/userModel.js";
import { createHash, isValidPassword } from '../utils/functionsUtils.js';

class UserManagerDB{

    async registerUser(user){
        try {
            if(user.email == 'adminCoder@coder.com' && isValidPassword(user, 'adminCod3r123')){
                user.password = createHash(user.password);
                const result = await userModel.create(user);
                result.role = 'admin';
                result.save();
                return result;
            }

            user.password = createHash(user.password);
            const result = await userModel.create(user);
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Registration error.`);
        }
    }

    async createUserCart(uid, cid){
        try {
            const result = await userModel.findByIdAndUpdate(uid, { cart: cid });
            return result;
        } catch (error) {
            console.error(error.message);
        }
    }

    async findUserByEmail(email) {
        try {
          const result = await userModel.findOne({ email: email }).lean();
          return result;
        } catch (error) {
          console.error(error);
        }
      }
}

export default UserManagerDB;