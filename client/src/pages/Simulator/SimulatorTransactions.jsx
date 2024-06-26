//React refs:
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";

import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

//User made refs:
import axios from "../../api/axiosConfig.js"
import image from "../../images/newwordCoin4.png"
import { setUserCostInHand, setUserCostInvested, setCostInCreditsWallet } from "../../redux/userSlice.js"
import { trefoil } from 'ldrs'
import NetworkError from '../Network Error Page/NetworkError.jsx';
trefoil.register()

const cardStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '50%',
    marginBottom: "3rem",
    backgroundImage: `url(${image})`,
    backgroundRepeat: 'no-repeat',
    opacity: 0.8,
    objectFit: 'cover',
};

const overlayStyle = {
    position: 'absolute',
    width: '25%',
};

const partStyle = {
    flex: 1,
    padding: '20px',
    border: '1px solid #ccc',
    position: 'relative',
    zIndex: 1,
};

const firstdiv = {
    flex: '0 0 2%',
    border: '1px solid #ccc',
    position: 'relative',
    zIndex: 1,
};

const secondDiv = {
    flex: '0 0 50%',
    margin: '10px',
    position: 'relative',
    zIndex: 1,
};

const thirddiv = {
    flex: '0 0 5%',
    position: 'relative',
    zIndex: 1,
};

const headingStyle = {
    transform: 'rotate(-90deg)',
    fontWeight: '500',
    fontSize: '23px',
    marginTop: '70px'
};

const subHeadingStyle = {
    fontWeight: 'bold',
    fontSize: '20px',
    marginTop: '10px',
    marginBottom: '10px',
};

const hrStyle = {
    margin: '10px 0',
    border: '0',
    borderTop: '1px solid #ccc',
};

const buttonStyle = {
    marginTop: '10px',
    padding: '10px',
    margin: '10px',
    width: "60px",
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
};

const containerCardStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "2rem",
}

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function SimulatorTransactions() {

    const reduxUserData = useSelector((state) => state.userData)
    const dispatch = useDispatch();
    const [userTransactions, setUserTransactions] = useState([]);
    const [stockDetails, setStockDetails] = useState([]);

    function handleSellingStock(event) {
        event.preventDefault();
        const userID = reduxUserData.currentUser._id;

        const userInHand = reduxUserData.currentUser.costInHand;
        const userCostInvested = reduxUserData.currentUser.costInvested;
        const userWallet = reduxUserData.currentUser.wallet;

        const formData = new FormData(event.target);
        let transID;
        let purchaseVal;
        let currVall;
        for (let [name, value] of formData.entries()) {
            if (name == "transactionID")
                transID = value;
            if (name == "purchaseValue")
                purchaseVal = value;
            if (name == "currentValue")
                currVall = value;
        }
        console.log(formData.entries())
        if (!transID || !purchaseVal || !currVall) {
            console.log(transID);
            console.log(purchaseVal);
            console.log(currVall);
            toast.error('🥲 Data not Fetched', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        else {
            const finalUserData = {
                _id: userID,
                costInHand: userInHand,
                costInvested: userCostInvested,
                wallet: userWallet,
                transactionID: transID,
                purchaseValue: +(purchaseVal),
                currentValue: +(currVall)
            }
            console.log("Final User Data : ")
            console.log(finalUserData)
            let tempCostInHand = +(reduxUserData.currentUser.costInHand) + +(currVall);
            let tempCostInvested = +(reduxUserData.currentUser.costInvested) - +(purchaseVal);
            let tempWallet = +(tempCostInHand) + +(tempCostInvested)

            axios.post('/simulator/sellStock', finalUserData).then(() => {
                toast.success('🥳 Stock Sold Successfully!!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                })
            }).catch(() => {
                toast.error('Error In Buying!!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            })

            dispatch(setUserCostInHand(tempCostInHand));
            dispatch(setUserCostInvested(tempCostInvested));
            dispatch(setCostInCreditsWallet(tempWallet));
        }

    }

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(false);
                const userArrayID = {
                    arrayID: reduxUserData.currentUser.arrayID
                };
                const response = await axios.post('/simulator/getAllBoughtStocks', userArrayID);
                setUserTransactions(response.data.data.stockTransactionDetails);
                setStockDetails(response.data.data.stockDetails);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    if (loading) {
        return (
            <div style={{display: "flex" , justifyContent: "center", margin : "5rem 0rem"}}>
                <l-trefoil
                    size="40"
                    stroke="4"
                    stroke-length="0.15"
                    bg-opacity="0.1"
                    speed="1.4"
                    color="white"
                ></l-trefoil>
            </div>
        );
    }

    if (error) {
        return (
            <>
                <NetworkError/>
            </>
        )
    }

    return (
        <>
            <Box sx={{ width: '100%', marginTop: '40px' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value}
                        onChange={handleChange}
                        centered
                        textColor="secondary"
                        indicatorColor="secondary"
                        aria-label="secondary tabs example"
                    >

                        <Tab sx={{ color: 'white' }} label="All" {...a11yProps(0)} />
                        <Tab sx={{ color: 'white' }} label="Holdings" {...a11yProps(1)} />
                        <Tab sx={{ color: 'white' }} label="Sold" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <div style={containerCardStyle}>
                        {userTransactions.map((item, index) => (
                            <div style={cardStyle}>
                                <div style={{ ...overlayStyle }}></div>

                                <div style={firstdiv}>
                                    {item.inPossesion && <div style={headingStyle}>BOUGHT</div>}
                                    {!item.inPossesion && <div style={headingStyle}>SOLD</div>}
                                </div>

                                <div style={secondDiv}>
                                    <div style={subHeadingStyle}>Chai Trade Exchange</div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
                                            <div style={{ fontWeight: "bold" }}>{stockDetails[index].chart_name}</div>
                                            {/* <div>Current Price: $<span style={{ fontWeight: "bold" }}>{stockDetails[index].chart_ltp}</span></div> */}
                                        </div>
                                        <hr style={hrStyle} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '5px' }}>
                                            <div style={{ flexDirection: 'column' }}>
                                                <div style={{ marginBottom: '5px' }}>Purchased Date:</div>
                                                <div style={{ marginTop: '5px', fontWeight: "bold" }}>{item.purchaseDate}</div>
                                            </div>
                                            <div style={{ flexDirection: 'column' }}>
                                                <div style={{ marginBottom: '5px' }}>Purchased Price:</div>
                                                <div style={{ marginTop: '5px', fontWeight: "bold" }}>${item.purchasePrice}</div>
                                            </div>
                                            {item.inPossesion && <form onSubmit={handleSellingStock}>
                                                <input style={{ display: "none" }} name='transactionID' value={item._id} />
                                                <input style={{ display: "none" }} name='purchaseValue' value={item.purchasePrice} />
                                                <input style={{ display: "none" }} name='currentValue' value={stockDetails[index].chart_ltp} />
                                                <button type='submit' style={buttonStyle}>Sell</button>
                                            </form>}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ ...partStyle, borderRight: '1px solid #ccc' }}>
                                    <div style={thirddiv}>
                                        <div style={subHeadingStyle}>Chai Trade Exchange</div>
                                        {!item.inPossesion && <div>
                                            <div style={{ marginBottom: "5px" }}>Sold Price: $<span style={{ fontWeight: "bold" }}>{(item.sellingPrice).toFixed(3)}</span></div>
                                            <div style={{ marginBottom: "5px" }}>P & L Price : $<span style={{ fontWeight: "bold" }}>{(item.sellingPrice - item.purchasePrice).toFixed(3)}</span></div>
                                            <div style={{ marginBottom: "5px" }}>P & L% : <span style={{ fontWeight: "bold" }}>{(((item.sellingPrice - item.purchasePrice) / item.purchasePrice) * 100).toFixed(3)}</span>%</div>
                                            <div style={{ marginBottom: "5px" }}>Sold Date: <span style={{ fontWeight: "bold" }}>{item.sellingDate}</span></div>
                                        </div>}
                                        {item.inPossesion && <div>
                                            <div style={{ margin: "1rem 0rem" }}>P & L Price : $<span style={{ fontWeight: "bold" }}>{(stockDetails[index].chart_ltp - item.purchasePrice).toFixed(3)}</span></div>
                                            <div>P & L% : <span style={{ fontWeight: "bold" }}>{(((stockDetails[index].chart_ltp - item.purchasePrice) / item.purchasePrice) * 100).toFixed(3)}%</span></div>
                                        </div>}
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <div style={containerCardStyle}>
                        {userTransactions.map((item, index) => (
                            <div style={cardStyle}>
                                {item.inPossesion && <div style={{ ...overlayStyle }}></div>}

                                {item.inPossesion && <div style={firstdiv}>
                                    {item.inPossesion && <div style={headingStyle}>BOUGHT</div>}
                                    {!item.inPossesion && <div style={headingStyle}>SOLD</div>}
                                </div>}

                                {item.inPossesion && <div style={secondDiv}>
                                    <div style={subHeadingStyle}>Chai Trade Exchange</div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
                                            <div style={{ fontWeight: "bold" }}>{stockDetails[index].chart_name}</div>
                                            {/* <div>Current Price: $<span style={{ fontWeight: "bold" }}>{stockDetails[index].chart_ltp}</span></div> */}
                                        </div>
                                        <hr style={hrStyle} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '5px' }}>
                                            <div style={{ flexDirection: 'column' }}>
                                                <div style={{ marginBottom: '5px' }}>Purchased Date:</div>
                                                <div style={{ marginTop: '5px', fontWeight: "bold" }}>{item.purchaseDate}</div>
                                            </div>
                                            <div style={{ flexDirection: 'column' }}>
                                                <div style={{ marginBottom: '5px' }}>Purchased Price:</div>
                                                <div style={{ marginTop: '5px', fontWeight: "bold" }}>${item.purchasePrice}</div>
                                            </div>
                                            {item.inPossesion && <form onSubmit={handleSellingStock}>
                                                <input style={{ display: "none" }} name='transactionID' value={item._id} />
                                                <input style={{ display: "none" }} name='purchaseValue' value={item.purchasePrice} />
                                                <input style={{ display: "none" }} name='currentValue' value={stockDetails[index].chart_ltp} />
                                                <button type='submit' style={buttonStyle}>Sell</button>
                                            </form>}
                                        </div>
                                    </div>
                                </div>}

                                {item.inPossesion && <div style={{ ...partStyle, borderRight: '1px solid #ccc' }}>
                                    <div style={thirddiv}>
                                        <div style={subHeadingStyle}>Chai Trade Exchange</div>
                                        {!item.inPossesion && <div>
                                            <div style={{ marginBottom: "5px" }}>Sold Price: $<span style={{ fontWeight: "bold" }}>{(item.sellingPrice).toFixed(3)}</span></div>
                                            <div style={{ marginBottom: "5px" }}>P & L Price : $<span style={{ fontWeight: "bold" }}>{(item.sellingPrice - item.purchasePrice).toFixed(3)}</span></div>
                                            <div style={{ marginBottom: "5px" }}>P & L% : <span style={{ fontWeight: "bold" }}>{(((item.sellingPrice - item.purchasePrice) / item.purchasePrice) * 100).toFixed(3)}</span>%</div>
                                            <div style={{ marginBottom: "5px" }}>Sold Date: <span style={{ fontWeight: "bold" }}>{item.sellingDate}</span></div>
                                        </div>}
                                        {item.inPossesion && <div>
                                            <div style={{ margin: "1rem 0rem" }}>P & L Price : $<span style={{ fontWeight: "bold" }}>{(stockDetails[index].chart_ltp - item.purchasePrice).toFixed(3)}</span></div>
                                            <div>P & L% : <span style={{ fontWeight: "bold" }}>{(((stockDetails[index].chart_ltp - item.purchasePrice) / item.purchasePrice) * 100).toFixed(3)}%</span></div>
                                        </div>}
                                    </div>
                                </div>}

                            </div>
                        ))}
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    <div style={containerCardStyle}>
                        {userTransactions.map((item, index) => (
                            <div style={cardStyle}>
                                {!item.inPossesion && <div style={{ ...overlayStyle }}></div>}

                                {!item.inPossesion && <div style={firstdiv}>
                                    {item.inPossesion && <div style={headingStyle}>BOUGHT</div>}
                                    {!item.inPossesion && <div style={headingStyle}>SOLD</div>}
                                </div>}

                                {!item.inPossesion && <div style={secondDiv}>
                                    <div style={subHeadingStyle}>Chai Trade Exchange</div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
                                            <div style={{ fontWeight: "bold" }}>{stockDetails[index].chart_name}</div>
                                            {/* <div>Current Price: $<span style={{ fontWeight: "bold" }}>{stockDetails[index].chart_ltp}</span></div> */}
                                        </div>
                                        <hr style={hrStyle} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '5px' }}>
                                            <div style={{ flexDirection: 'column' }}>
                                                <div style={{ marginBottom: '5px' }}>Purchased Date:</div>
                                                <div style={{ marginTop: '5px', fontWeight: "bold" }}>{item.purchaseDate}</div>
                                            </div>
                                            <div style={{ flexDirection: 'column' }}>
                                                <div style={{ marginBottom: '5px' }}>Purchased Price:</div>
                                                <div style={{ marginTop: '5px', fontWeight: "bold" }}>${item.purchasePrice}</div>
                                            </div>
                                            {item.inPossesion && <form onSubmit={handleSellingStock}>
                                                <input style={{ display: "none" }} name='transactionID' value={item._id} />
                                                <input style={{ display: "none" }} name='purchaseValue' value={item.purchasePrice} />
                                                <input style={{ display: "none" }} name='currentValue' value={stockDetails[index].chart_ltp} />
                                                <button type='submit' style={buttonStyle}>Sell</button>
                                            </form>}
                                        </div>
                                    </div>
                                </div>}

                                {!item.inPossesion && <div style={{ ...partStyle, borderRight: '1px solid #ccc' }}>
                                    <div style={thirddiv}>
                                        <div style={subHeadingStyle}>Chai Trade Exchange</div>
                                        {!item.inPossesion && <div>
                                            <div style={{ marginBottom: "5px" }}>Sold Price: $<span style={{ fontWeight: "bold" }}>{(item.sellingPrice).toFixed(3)}</span></div>
                                            <div style={{ marginBottom: "5px" }}>P & L Price : $<span style={{ fontWeight: "bold" }}>{(item.sellingPrice - item.purchasePrice).toFixed(3)}</span></div>
                                            <div style={{ marginBottom: "5px" }}>P & L% : <span style={{ fontWeight: "bold" }}>{(((item.sellingPrice - item.purchasePrice) / item.purchasePrice) * 100).toFixed(3)}</span>%</div>
                                            <div style={{ marginBottom: "5px" }}>Sold Date: <span style={{ fontWeight: "bold" }}>{item.sellingDate}</span></div>
                                        </div>}
                                        {item.inPossesion && <div>
                                            <div style={{ margin: "1rem 0rem" }}>P & L Price : $<span style={{ fontWeight: "bold" }}>{(stockDetails[index].chart_ltp - item.purchasePrice).toFixed(3)}</span></div>
                                            <div>P & L% : <span style={{ fontWeight: "bold" }}>{(((stockDetails[index].chart_ltp - item.purchasePrice) / item.purchasePrice) * 100).toFixed(3)}%</span></div>
                                        </div>}
                                    </div>
                                </div>}

                            </div>
                        ))}
                    </div>
                </CustomTabPanel>
            </Box>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <ToastContainer />
        </>
    );
}