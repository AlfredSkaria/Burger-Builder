import React, {Component} from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/Ui/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/orderSummary';
import axios from '../../../src/axios-orders';
import Spinner from '../../components/Ui/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};


class BurgerBuilder extends Component{
    // constructor(props){
    //     super(props);
    //     this.state = {}
    // }

    state={
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    };

    componentDidMount() {

        console.log('[BurgerBuilder] ', this.props);
        axios.get('https://react-my-burger-f58f3.firebaseio.com/ingredients.json')
             .then(res => {
                this.setState({ingredients: res.data});
             })
             .catch(error => {
                 this.setState({error: true})
             });
    }

    updatePurchaseState(ingredients){
        //const ingredients = {...this.state.ingredients};

        const sum = Object.keys(ingredients)
                          .map(igKey => {
                              return ingredients[igKey];
                          })
                          .reduce( (sum, el) =>{
                              return sum + el;
                          } , 0);
        this.setState({purchasable: sum > 0});
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {...this.state.ingredients};
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
  
    }

    removeIngredientHandler = (type) => {

        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0){
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {...this.state.ingredients};
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
  
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    };

    purchaseContinueHandler = () => {
        //alert('You continue');
        // this.setState({loading: true});
        // const order = {
        //     ingredients: this.state.ingredients,
        //     price: this.state.totalPrice,
        //     customer:{
        //         name: 'Alfred Skaria',
        //         address:{
        //             street:  'Nambiar Road, Puthur P.O',
        //             zipCode: '680014',
        //             country: 'India'
        //         },
        //         email:'alfiskaria@gmail.com'
        //     },
        //     deliveryMethod: 'fastest'
        // }
        // axios.post('/orders.json', order)
        //      .then( res => 
        //         this.setState({loading: false, purchasing: false}))
        //      .catch(error => 
        //         this.setState({loading: false, purchasing: false})
        //     );
        this.props.history.push('/checkout');
    };

    render() {

        const disabledInfo = {
            ...this.state.ingredients
        };

        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <=0 
        }

        let orderSummary = null;
        let burger = this.state.error? <p>Ingredients can't be loaded</p> : <Spinner/>;

        if(this.state.ingredients){
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls 
                        ingredientAdded={this.addIngredientHandler}
                        ingredientsRemoved = {this.removeIngredientHandler}
                        disabled={disabledInfo}
                        price={this.state.totalPrice}
                        purchasable={this.state.purchasable}
                        ordered = {this.purchaseHandler}
                    />
                </Aux>);
            orderSummary = <OrderSummary 
                price = {this.state.totalPrice}
                ingredients={this.state.ingredients}
                purchaseCanceled = {this.purchaseCancelHandler}
                purchaseContinued = {this.purchaseContinueHandler}/>
        }

        if(this.state.loading){
            orderSummary = <Spinner/>;
        }
        

        return (
            <Aux>
                <Modal show={this.state.purchasing}
                       modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);