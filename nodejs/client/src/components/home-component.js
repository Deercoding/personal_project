import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image, Card, Button, Row, Form, Select, Input, List } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
const { Search } = Input;

const HomeComponent = () => {
  const { Option } = Select;

  const [officialLevel, setOfficialLevel] = useState("");
  const [gym, setGym] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [gameAd, setGameAd] = useState([]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  let navigate = useNavigate();

  const handleResultClick = (roomNumericId) => {
    navigate(`/wallroom/${roomNumericId}`);
  };

  const handleOfficialLevelChange = (event) => {
    console.log(event);
    setOfficialLevel(event);
  };

  const handleGymChange = (event) => {
    setGym(event);
  };

  const handleAdClick = () => {
    if (gameAd.game_id) {
      navigate(`/gamedetail/${gameAd.game_id}`);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    fetchAdData();
  }, []);

  const fetchAdData = async () => {
    try {
      let gameAd = await fetch(
        `${process.env.REACT_APP_SERVER_URL}api/ad/?ad_location_id=1`
      );
      gameAd = await gameAd.json();
      if (gameAd.length > 0) {
        setGameAd(gameAd[0]);
      } else {
        setGameAd({
          ad_image: "game-main-image.jpg_1701348260614.jpg",
          // game_id: 67,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = () => {
    setIsLoading(true);
    fetch(
      `${process.env.REACT_APP_SERVER_URL}api/search?official_level=${officialLevel}&gym=${gym}&searchtags=${input}`
    )
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        setSearchResults(data.data || []);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching data:", error);
      });
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
    setSuggestions([]);
  };

  const fetchAutocompleteResults = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}api/search/tags?mysearch=${input}`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (input.length > 0) {
      fetchAutocompleteResults();
    } else {
      setSuggestions([]);
    }
  }, [input]);

  const handleInputChange = (value) => {
    setInput(value);
  };

  const handleSelectOption = (value) => {
    setInput(value.target.textContent);
    setSuggestions([]);
  };

  return (
    <div id="home-container">
      <div>
        <Image
          style={{ maxHeight: "400px" }}
          src={`https://d23j097i06b1t0.cloudfront.net/${gameAd.ad_image}`}
          preview={false}
          onClick={() => handleAdClick()}
        />
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <Form>
        <Form.Item name="gym" label="岩館">
          <Select placeholder="合作岩館" onChange={handleGymChange} allowClear>
            <Option value="岩館一">攀岩石樂樂合作岩館</Option>
            <Option value="快樂岩館">快樂岩館</Option>
            <Option value="岩壁探險谷">岩壁探險谷</Option>
            <Option value="岩漫天地">岩漫天地</Option>
          </Select>
        </Form.Item>
        <Form.Item name="officialLevel" label="官方等級">
          <Select
            placeholder="VB-V9"
            onChange={handleOfficialLevelChange}
            allowClear
          >
            <Option value="B">VB</Option>
            <Option value="0">V0</Option>
            <Option value="1">V1</Option>
            <Option value="2">V2</Option>
            <Option value="3">V3</Option>
            <Option value="4">V4</Option>
            <Option value="5">V5</Option>
            <Option value="6">V6</Option>
            <Option value="7">V7</Option>
            <Option value="8">V8</Option>
            <Option value="9">V9</Option>
          </Select>
        </Form.Item>

        <div>
          <Input
            placeholder="找找標籤 EX:動態/指力/flag"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
          />
          {suggestions.length > 0 && (
            <List
              size="small"
              dataSource={suggestions}
              renderItem={(option) => <List.Item>{option}</List.Item>}
              onClick={(e) => handleSelectOption(e)}
            />
          )}
        </div>

        <br></br>

        <Form.Item>
          <Button
            type="text"
            htmlType="submit"
            onClick={(e) => handleSubmit(e)}
          >
            Search
          </Button>
        </Form.Item>
      </Form>
      <br></br>
      {isLoading ? (
        <p>
          Searching <LoadingOutlined />
        </p>
      ) : (
        searchResults?.map((result, index) => (
          <Row
            key={index}
            onClick={() => handleResultClick(result.roomNumericId)}
          >
            <Card>
              <Row>
                <div id="home-wall-info">
                  <strong>
                    岩牆: {result.gym_id} {result.wall} {result.color}
                  </strong>
                  <p>官方等級: {result.official_level}</p>
                  <p>聊天熱度: {result.roomChatCount}</p>
                  <p>Beta影片: {result.videoCount}</p>
                  <p>更新時間: {formatDate(result.wallUpdateDate)}</p>
                  <p>換線時間: {formatDate(result.wallChangeDate)}</p>
                  <p>#tags: {result.tags.join("/")}</p>
                </div>
                <br></br>
                <div>
                  <Image width={250} src={result.wallimage} preview={false} />
                </div>
              </Row>
            </Card>
          </Row>
        ))
      )}
    </div>
  );
};

export default HomeComponent;
