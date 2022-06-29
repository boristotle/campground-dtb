import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import sitemap from '../../images/cane-creek-camp-map.png';
import { fetchAvailability, setFormDataItem } from '../../_actions';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class BookOnline extends React.Component {

    constructor(props) {
        super(props);

        this.scrollElement = React.createRef();

        this.state = {
            checkin: this.props.formData.checkin || localStorage.getItem('checkin') ? new Date(localStorage.getItem('checkin')) : new Date(new Date().setHours(0,0,0,0)),
            checkout: this.props.formData.checkout || localStorage.getItem('checkin') ? new Date(localStorage.getItem('checkout')) : new Date(localStorage.getItem('cehckout')),
            // numberOfACs: 0,
            // tentCamping: false,
            showConfirmBtn: {}
        };
    }

    componentDidMount() {
        if (this.props.formData.checkin !== '' && this.props.formData.checkout !== '') {
            this.props.fetchAvailability(this.props.formData.checkin, this.props.formData.checkout);
            // this.setState({
            //     ...this.state,
            //     checkin: this.props.formData.checkin || localStorage.getItem('checkin') ? new Date(localStorage.getItem('checkin')) : new Date(new Date().setHours(0,0,0,0)),
            //     checkout: this.props.formData.checkout || localStorage.getItem('checkin') ? new Date(localStorage.getItem('checkout')) : new Date(localStorage.getItem('cehckout')),
            // })
        }
        

        this.props.setFormDataItem({
            alert: this.props.formData.alert || {},
            adults: this.props.formData.adults || 0,
            kids: this.props.formData.kids || 0,
            pets: this.props.formData.pets || 0,
            totalPrice: 0,
            subTotal: 0,
            taxes: 0,
            checkin: this.state.checkin || '',
            checkout: this.state.checkout || ''
        });

        const list = ReactDOM.findDOMNode(this.scrollElement.current);
        list.addEventListener('scroll', this.handleScroll());
      
    }

    componentDidUpdate() {}

    handleScroll = (e) => {
        let useWindow;
        const target = document.getElementById('scrollElement')
        const position = target.getBoundingClientRect();
      
        return useWindow
          ? { x: window.scrollX, y: window.scrollY }
          : { x: position.left, y: position.top }
    }

    setCheckin(date) {
        this.props.formData.checkin = date;
        this.setState(({checkin: date}));
    }

    setCheckout(date) {
        this.props.formData.checkout = date;
        this.setState(({checkout: date}));
    }
    

    generateAvailableSites = () => {
        if (this.props.availability.availableSites !== undefined) {
            return (this.props.availability.availableSites.map((available, idx) => {
                return (
                    <div key={'site-' + idx}>
                        <div className="site" id={available.id} onClick={() => this.selectSite(available.id)}>
                            <h4>Site {available.number}</h4>
                            <p>Price per night: ${available.price}</p>
                            <p>Number of nights: {this.props.availability.numberOfNights}</p>
                            <p>Total Price: ${available.price * this.props.availability.numberOfNights}</p>
                            {/* <div className={!this.state.showConfirmBtn[available.id] ? "carousel-button blue longer" : 'hide'}>Click to Select Site</div> */}
                            <button className={this.state.showConfirmBtn[available.id] ? "carousel-button blue longer" : 'hide'}><Link to="/payment">Confirm &amp; Pay</Link></button>

                        </div>
                    </div>
                )
            }))
        } else {
            return <div className="no-sites-text">No sites available for this time frame</div>
        }
    }

    selectSite = (id) => {
        let allSites = document.getElementsByClassName('site');
        let identifier = id;
        let element = document.getElementById(identifier);
        for (var i = 0; i < allSites.length; i++) {
            allSites[i].style.borderColor = '#6c757d';
            allSites[i].style.borderWidth = '1px';
        }
        element.style.borderColor = '#6FA9B4';
        element.style.borderWidth = '3px';

        this.setState({ showConfirmBtn: { [id]: true } });

        this.props.availability.availableSites.forEach(site => {
            if (site.id === id) {
                this.props.setFormDataItem({ selectedSite: site});
            }
        })
    }

    handleChange = (e, inputName) => {
        this.props.setFormDataItem({[inputName]: e.target.value}); 
    }

    getAvailableSites = () => {
        if (this.state.checkin !== '' && this.state.checkout !== '') {
            this.props.fetchAvailability(this.state.checkin, this.state.checkout);
        }
    }

    render() {
        return (
            <div className="container-fluid" id="scrollElement" ref={this.scrollElement}>
                <div className="booking-strip">
                    <div className="form-group">
                        <label className="form-label">Checkin </label>
                        <DatePicker selected={this.state.checkin} onChange={(date) => this.setCheckin(date)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Checkout </label>
                        <DatePicker selected={this.state.checkout} onChange={(date) => this.setCheckout(date)} />
                    </div>
                    <button className="carousel-button blue" onClick={() => this.getAvailableSites()}>Update</button>
                </div>

                <div className="row available-sites-with-map">
                    <div className="col-lg-6 section-left available-sites">
                        <h3>Available Sites</h3>
                        {this.generateAvailableSites()}
                    </div>
                    <div className="col-lg-6 section-right sitemap">
                        <h3>Site Map</h3>
                        <img width="100%" alt="tree" src={sitemap}/>
                    </div>
                </div>
            </div>
        );
    };
}


const mapStateToProps = (state, ownProps) => {
    return {
        formData: state.formData,
        availability: state.availability
    }

}

export default connect(mapStateToProps, {fetchAvailability, setFormDataItem}) (BookOnline);