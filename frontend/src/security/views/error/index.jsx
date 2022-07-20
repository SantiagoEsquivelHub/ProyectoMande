import error404 from '../../../assets/images/error404.png';
import './error.css'
const ErrorView = () => {
    return (
        <div className='error404'>
            <h1 className='font'>404 NOT FOUND</h1>
            <img src={error404} alt="" />
            <h2>No hemos podido encontrar la página que buscas.</h2>
            <h4>Atentamente, </h4>
            <h5>Engineers</h5>
        </div>


    )
}

export default ErrorView;