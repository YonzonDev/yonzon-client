import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toPng } from "html-to-image";
import { Container, Row, Col, Card, Dropdown } from "react-bootstrap";
import {
  BsTags,
  BsCrosshair,
  BsDatabase,
  BsCaretDownFill,
  BsCaretUpFill,
  BsDownload,
} from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { getTransactions } from "../../redux/actions/itemAction";

import "./Dashboard.css";
import Footer from "../../components/footer/Footer";
import SynchronizedLineChart from "../../components/line-chart/SynchronizedLineChart";

const Dashboard = () => {
  const navigate = useNavigate();
  // Set up redux fetching
  const dispatch = useDispatch();
  const { transactions } = useSelector((state) => state.item.getTransactions); // destructure get transactions

  // Get access type; owner (1) and cashier (2)
  const access = useSelector((state) => state.auth.user.access_type);

  const [filterOption, setFilterOption] = useState(null);
  const filterOptions = ["Yearly", "Monthly", "Weekly", "Daily"];

  // Sorting option state
  const [bestSellers, setBestSellers] = useState([]);

  // Set transaction values
  const [transactionValues, setTransactionValues] = useState([]);

  // Update card
  const [lastUpdated, setLastUpdated] = useState(null);

  // Revenue card
  const [totalRevenue, setTotalRevenue] = useState(null);

  // Quota card
  const [dailyQuota, setDailyQuota] = useState(null);
  const [isDailyQuota, setIsDailyQuota] = useState(false);

  // Total best seller items shown
  const bestSellersAmount = 5;
  const quota = 10;

  // How many characters shown in best seller
  const maximumCharacters = 20;

  useEffect(() => {
    if (access === 2) {
      navigate("/invoice");
    }
  });

  useEffect(() => {
    const handleBestSellers = async () => {
      // Make a copy of transactionValues
      const rawTransactions = [...transactionValues];

      // Filter transactions based on filterOption
      const filteredTransactions = rawTransactions.filter((transaction) => {
        const [year, month, day] = transaction.date.split("/");
        const transactionDate = new Date(year, month - 1, day);

        switch (filterOption) {
          case "Daily":
            return (
              transactionDate.getFullYear() === parseInt(todayYear) &&
              transactionDate.getMonth() + 1 === parseInt(todayMonth) &&
              transactionDate.getDate() === parseInt(todayDay)
            );
          case "Weekly":
            return (
              transactionDate >= new Date(todayYear, todayMonth - 1, todayDay)
            );
          case "Monthly":
            return transactionDate >= new Date(todayYear, todayMonth - 1, 1);
          case "Yearly":
            return transactionDate >= new Date(todayYear, 0, 1);
          default:
            return true; // No filter applied
        }
      });

      // Sorting transactionsCopy by orders in descending order
      const sortedTransactions = filteredTransactions.sort(
        (a, b) => b.orders - a.orders
      );

      const uniqueBestSellers = new Set(); // Use a Set to store unique items
      sortedTransactions.slice(0, bestSellersAmount).forEach((transaction) => {
        uniqueBestSellers.add(transaction.model);
      });

      setBestSellers([...uniqueBestSellers]);
    };

    // Responsible for saving transaction values
    setTransactionValues(transactions);

    handleBestSellers();
  }, [filterOption, transactions, transactionValues, setBestSellers]);

  // Get update status state
  useEffect(() => {
    // Responsible for Update Stock card
    const latestUpdate = transactionValues.slice(-1)[0]?.date;
    setLastUpdated(latestUpdate);
  }, [transactionValues]);

  const [todayYear, setTodayYear] = useState(null);
  const [todayMonth, setTodayMonth] = useState(null);
  const [todayDay, setTodayDay] = useState(null);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    // const weekStart = new Date(
    //   year,
    //   today.getMonth(),
    //   today.getDate() - today.getDay()
    // );
    // const monthStart = new Date(year, today.getMonth(), 1);
    // const yearStart = new Date(year, 0, 1);

    setTodayYear(year);
    setTodayMonth(month);
    setTodayDay(day);

    switch (filterOption) {
      case "Daily":
        setTotalRevenue(0);
        break;
      case "Weekly":
        setTotalRevenue(0);
        break;
      case "Monthly":
        setTotalRevenue(0);
        break;
      case "Yearly":
        setTotalRevenue(0);
        break;
      default:
        break;
    }
  }, [filterOption]);

  useEffect(() => {
    const calculateTotalRevenue = () => {
      let totalRevenueTimeFrame = 0;
      const filterTransactions = (transaction) => {
        const [year, month, day] = transaction.date.split("/");
        const transactionDate = new Date(year, month - 1, day);

        switch (filterOption) {
          case "Daily":
            return (
              transactionDate.getFullYear() === parseInt(todayYear) &&
              transactionDate.getMonth() + 1 === parseInt(todayMonth) &&
              transactionDate.getDate() === parseInt(todayDay)
            );
          case "Weekly":
            return (
              transactionDate >= new Date(todayYear, todayMonth - 1, todayDay)
            );
          case "Monthly":
            return transactionDate >= new Date(todayYear, todayMonth - 1, 1);
          case "Yearly":
            return transactionDate >= new Date(todayYear, 0, 1);
          default:
            return false;
        }
      };

      const filteredTransactions = transactions.filter(filterTransactions);

      filteredTransactions.forEach((transaction) => {
        totalRevenueTimeFrame += transaction.price;
      });

      setTotalRevenue(totalRevenueTimeFrame);
    };

    calculateTotalRevenue();
  }, [filterOption, transactions, todayYear, todayMonth, todayDay]);

  // Get the daily quota
  useEffect(() => {
    // Get the current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split("T")[0];

    // Filter transactions for the current date
    const transactionsForToday = transactionValues.filter((transaction) => {
      // Extract the date string from the transaction
      const transactionDate = transaction.date
        .split("T")[0]
        .replace(/\//g, "-");
      // Check if the transaction occurred on the current date
      return transactionDate === currentDate;
    });

    // Calculate the daily quota based on transactions for today
    const totalSales = (transactionsForToday.length / quota) * 10;

    setDailyQuota(totalSales);

    // Set isDailyQuota to true to indicate that the daily quota has been calculated
    setIsDailyQuota(totalSales >= 50);
  }, [transactionValues, quota]);

  // Get transactions redux fetch
  useEffect(() => {
    const fetchTransactions = () => {
      dispatch(getTransactions());
    };

    fetchTransactions();
  }, [dispatch]);

  // Comma based on number digits logic
  const formatNumber = (num) => {
    if (num) {
      const numStr = num.toString();

      const numDigits = numStr.length;

      if (numDigits >= 4) {
        return `${numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.00`;
      }

      return `${numStr}.00`;
    }

    return "0.00";
  };

  // When length of characters exceeds
  const formatText = (text) => {
    if (text.length > maximumCharacters) {
      return text.substring(0, maximumCharacters) + "...";
    }

    return text;
  };

  // Sales cards
  const stocks = {
    description: "Up to date",
    date: lastUpdated,
  };

  const sales = {
    total: `${dailyQuota}%`,
    isIncrease: isDailyQuota,
    date: new Date().toLocaleString(),
  };

  // Data date formatting
  const date = new Date();

  // Yearly
  // Group transactions by day and sum orders for each day within the last 3 days
  const yearlyOrders = transactions.reduce((acc, transaction) => {
    const year = transaction.date.split("/")[0];
    if (!acc[year]) {
      acc[year] = 0;
    }
    acc[year] += transaction.orders;
    return acc;
  }, {});

  // Convert yearlyOrders object into the desired format
  const yearly = [];

  for (let i = 0; i <= 6; i++) {
    const year = date.getFullYear() - i;
    const orders = yearlyOrders[year.toString()] || 0; // If there are no orders for a year, default to 0
    yearly.push({
      name: year,
      pv: orders,
    });
  }

  // Monthly
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Initialize monthly orders object with all months and zero orders
  const monthlyOrders = months.reduce((acc, month) => {
    acc[month] = 0;
    return acc;
  }, {});

  // Group transactions by month and sum orders for each month
  transactions.forEach((transaction) => {
    const [year, month] = transaction.date.split("/").slice(0, 2);
    const monthName = months[parseInt(month) - 1]; // Convert month number to month name
    monthlyOrders[monthName] += transaction.orders;
  });

  // Convert monthlyOrders object into the desired format
  const monthly = Object.keys(monthlyOrders).map((month) => ({
    name: month,
    pv: monthlyOrders[month],
  }));

  // Weekly
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dailyOrders = daysOfWeek.reduce((acc, day) => {
    acc[day] = 0;
    return acc;
  }, {});

  // Group transactions by day of the week and sum orders for each day
  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    const dayOfWeek = daysOfWeek[transactionDate.getDay()]; // Get the day of the week
    dailyOrders[dayOfWeek] += transaction.orders;
  });

  // Convert dailyOrders object into the desired format
  const daily = Object.keys(dailyOrders).map((day) => ({
    name: day,
    pv: dailyOrders[day],
  }));

  // Weekly
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];

  const weekly = weeks.map((week, index) => {
    const weekOrders = transactions.reduce((total, transaction) => {
      const transactionDate = new Date(transaction.date);
      const weekOfMonth = Math.ceil(transactionDate.getDate() / 7);

      if (weekOfMonth === index + 1) {
        return total + transaction.orders;
      }
      return total;
    }, 0);

    return {
      name: week,
      pv: weekOrders,
    };
  });

  // // Daily
  // const today = new Date();
  // const yesterday = new Date();
  // yesterday.setDate(today.getDate() - 1); // Subtract 1 day from current date

  // // Group transactions by day and sum orders for today and yesterday
  // const dailyOrders = transactions.reduce((acc, transaction) => {
  //   const transactionDate = new Date(transaction.date);
  //   if (
  //     transactionDate.toDateString() === today.toDateString() ||
  //     transactionDate.toDateString() === yesterday.toDateString()
  //   ) {
  //     const formattedDate = transactionDate.toDateString(); // Convert date to string format
  //     if (!acc[formattedDate]) {
  //       acc[formattedDate] = 0;
  //     }
  //     acc[formattedDate] += transaction.orders;
  //   }
  //   return acc;
  // }, {});

  // // Convert dailyOrders object into the desired format
  // const daily = Object.keys(dailyOrders).map((date) => ({
  //   name: date,
  //   pv: dailyOrders[date],
  // }));

  const handleDownload = async (containerId) => {
    const containerNode = document.getElementById(containerId);
    try {
      const dataUrl = await toPng(containerNode);
      const link = document.createElement("a");
      link.download = `${containerId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error(`Unable to generate .png due to ${error}.`);
    }
  };

  return (
    <Container className="dashboard-container">
      <Row>
        <Col md={7}>
          <Card className="mb-3 dashboard-card">
            <Card.Body>
              <Card.Title className="dashboard-title">
                Yonzon Autogears
              </Card.Title>
              <ul>
                <li>
                  <Card.Text>Info: Automotive Parts Store.</Card.Text>
                </li>
                <li>
                  <Card.Text>Mobile No: +63 917 352 9463.</Card.Text>
                </li>
                <li>
                  <Card.Text>
                    Address: G/F Unit 1 Cer-hil Service Rd., Cer-hil
                    Subdivision, Brgy. Quebiawan San Fernando, 2000.
                  </Card.Text>
                </li>
                <li>
                  <Card.Text>Status: Updated</Card.Text>
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={5}>
          <Card className="mb-3 dashboard-card">
            <Card.Body>
              <Row>
                <Col>
                  <Card.Title className="dashboard-title">
                    Best Sellers
                  </Card.Title>
                </Col>
                <Col>
                  <Dropdown className="filter-option">
                    <Dropdown.Toggle
                      id="dropdown-basic"
                      className="dashboard-form"
                    >
                      {filterOption || "All Time"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {filterOptions.map((item, index) => (
                        <Dropdown.Item
                          key={index}
                          onClick={() => setFilterOption(item)}
                        >
                          {item}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
              <ol>
                {bestSellers.map((bestSeller, index) => (
                  <li key={index}>
                    <Card.Text>{formatText(bestSeller)}</Card.Text>
                  </li>
                ))}
              </ol>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        {/* Second Row */}
        <Col md={4}>
          <Card className="mb-3 dashboard-card">
            <Card.Body>
              <Card.Title className="dashboard-title">
                <BsDatabase
                  className="mx-1 mb-1"
                  style={{ width: "25px", height: "25px" }}
                />
                Updated Stock
              </Card.Title>
              <Card.Text>
                {!stocks.date ? "Not updated" : stocks.date}
              </Card.Text>
              <Card.Text>{stocks.description}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3 dashboard-card">
            <Card.Body>
              <Card.Title className="dashboard-title">
                <BsTags
                  className="mx-1"
                  style={{ width: "25px", height: "25px" }}
                />
                Total Revenue
              </Card.Title>
              <Card.Text>Revenue Based Monthly</Card.Text>
              <Card.Text>Php {formatNumber(totalRevenue)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3 dashboard-card">
            <Card.Body>
              <Card.Title className="dashboard-title">
                <BsCrosshair
                  className="mx-1"
                  style={{ width: "25px", height: "25px" }}
                />
                Today Sales
              </Card.Title>
              <Card.Text>Quota (based by {quota})</Card.Text>
              <Card.Text>
                {sales.isIncrease ? (
                  <BsCaretDownFill
                    style={{ color: "#fa1e4e", width: "25px", height: "25px" }}
                  />
                ) : (
                  <BsCaretUpFill
                    style={{ color: "#ffffff", width: "25px", height: "25px" }}
                  />
                )}{" "}
                {sales.total}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Last Row */}
      <Row>
        <Col>
          <Card className="dashboard-card" id="sales-chart">
            <Card.Body>
              <Card.Title>
                Yonzon Sales{" "}
                <BsDownload
                  className="dashboard-icon mx-3 mt-1"
                  onClick={() => handleDownload("sales-chart")}
                  style={{ width: "20px" }}
                />
              </Card.Title>
              <SynchronizedLineChart
                daily={daily}
                weekly={weekly}
                monthly={monthly}
                yearly={yearly}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Footer />
    </Container>
  );
};

export default Dashboard;
