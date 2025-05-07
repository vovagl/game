
import css from './card.module.css'
import back from '../img/back.jpg';

type CardProps={
  card:{
    id:number;
    value:number;
    identical:boolean;
  };
  handleChoice:(card:CardProps['card'])=>void;
  open:boolean;
  isDisabled:boolean;
}
const Card: React.FC<CardProps>=({card, handleChoice, open, isDisabled})=> {

    const handleClick=()=>{
        if (!isDisabled) { 
        handleChoice(card)
        }
    }
   
  return (
    <div className={css.card}>
    <div className={open ? css.open : ''}>
      <div className={css.front}>{card.value}</div>
      <img className={css.back} src={back} alt='back' onClick={handleClick}/>
    </div>
    </div>
  )
}
export default Card;