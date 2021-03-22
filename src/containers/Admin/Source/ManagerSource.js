import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "video-react/dist/video-react.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

import React, { useState, useEffect } from "react";
import { Tabs, Spin, Row, Col, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState, ContentState } from "draft-js";
import { Player } from "video-react"; // PosterImage
import {
  Image,
  Video,
  Transformation,
  CloudinaryContext,
} from "cloudinary-react";
import Source from "./Source";
import CategoryService from "../../../services/category.service";
import UserService from "../../../services/user.service";
import CategorygroupService from "../../../services/categorygroup.service";

import "./ManagerSource.scss";
const { TabPane } = Tabs;
const { Option } = Select;
const ManagetUser = () => {
  const [content, setContent] = useState();
  const [editorState, seteditorState] = useState();
  const [editorStateDraft, seteditorStateDraft] = useState();
  const [datasource, setdatasource] = useState([]);
  const [datasourceTemp, setdatasourceTemp] = useState([]);
  const [listTeacher, setlistTeacher] = useState([]);
  const [listCategoryGroup, setlistCategoryGroup] = useState([]);
  const [timeLeft, setTimeLeft] = useState(1);

  useEffect(() => {
    APIgetAllCategory();
    APIgetTeacher();
    APIgetAllCategoryGroup();
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      setTimeLeft(null);
    }

    if (!timeLeft) return;
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const APIgetAllCategory = () => {
    CategoryService()
      .getAllCategory()
      .then(
        (response) => {
          setdatasource(response.data);
          setdatasourceTemp(response.data);
          // console.log(response.data)
        },
        (error) => {
          const _content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setContent(_content);
        }
      );
  };
  const onEditorStateChange = (editorState) => {
    seteditorState(editorState);
    console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    const contentBlock = htmlToDraft(
      draftToHtml(convertToRaw(editorState.getCurrentContent()))
    );
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);

      seteditorStateDraft(editorState);
    }
  };

  const renderSpin = () => {
    return (
      <div className="example">
        <Spin tip={`Loading ${timeLeft}s...`} />
      </div>
    );
  };

  const txt_Changed = function (e) {
    const temp = datasource.filter((item) =>
      item.CategoryName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setdatasourceTemp(temp);
  };

  const APIgetTeacher = () => {
    UserService()
      .getAllUser()
      .then(
        (response) => {
          const data = [];
          for (let i = response.data.length - 1; i >= 0; i--) {
            if (response.data[i].JobId === 3) {
              data.push({
                UsersId: response.data[i].UsersId,
                DislayName: response.data[i].DislayName,
              });
            }
          }
          setlistTeacher(data);
          console.log(data);
        },
        (error) => {
          console.log(error);
        }
      );
  };
  function onChangeTeacher(value) {
    var temp;
    if (value) {
      temp = datasource.filter((item) =>
        item.NameTeacher.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      temp = datasource.filter((item) =>
        item.NameTeacher.toLowerCase().includes("")
      );
    }

    setdatasourceTemp(temp);
  }

  function onChangeCategoryGroup(value) {
    var temp;
    if (value) {
      temp = datasource.filter((item) =>
        item.CategoryGroupName.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      temp = datasource.filter((item) =>
        item.CategoryGroupName.toLowerCase().includes("")
      );
    }

    setdatasourceTemp(temp);
  }

  const APIgetAllCategoryGroup = () => {
    CategorygroupService()
      .getAllCategorygroup()
      .then(
        (response) => {
          setlistCategoryGroup(response.data);
          console.log(response.data);
        },
        (error) => {
          console.log(error);
        }
      );
  };
  return (
    <>
      <Row>
        <Col span={24}>
          <h2>Khóa học</h2>
        </Col>
        <Col span={10}>
          <Input
            placeholder="Tên khóa học"
            // size="large"
            onChange={(e) => txt_Changed(e)}
            prefix={
              <SearchOutlined style={{ fontSize: "16px", color: "#a3a3a3" }} />
            }
            style={{ borderRadius: 8 }}
            allowClear
          />
        </Col>

        <Col span={3} className="ml-3">
          <Select
            showSearch
            allowClear
            style={{ width: 200 }}
            placeholder="Lọc theo giảng viên.."
            optionFilterProp="children"
            onChange={onChangeTeacher}
            // onSearch={onSearchTeacher}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {listTeacher.map((item, index) => (
              <Option key={index} value={item.DislayName}>
                {item.DislayName}
              </Option>
            ))}
          </Select>
        </Col>

        <Col span={6} className="ml-3">
          <Select
            showSearch
            allowClear
            style={{ width: 200 }}
            placeholder="Lọc theo chuyên đề..."
            optionFilterProp="children"
            onChange={onChangeCategoryGroup}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {listCategoryGroup.map((item, index) => (
              <Option key={index} value={item.CategoryGroupName}>
                {item.CategoryGroupName}
              </Option>
            ))}
          </Select>
        </Col>

        <Col span={24} className="mt-5">
          {timeLeft ? (
            renderSpin()
          ) : (
            <Source
              datasource={datasourceTemp}
              APIgetAllCategory={APIgetAllCategory}
            ></Source>
          )}
        </Col>

        <Col span={24}>
          <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={onEditorStateChange}
          />
          <textarea
            disabled
            style={{ width: "100%" }}
            value={
              editorState &&
              draftToHtml(convertToRaw(editorState.getCurrentContent()))
            }
          />
          <Editor
            editorState={editorStateDraft}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
          />

          
        </Col>
      </Row>
    </>
    // <Tabs type="card">
    //   <TabPane tab="tab1" key="1">

    //   </TabPane>
    //   <TabPane tab="tab2" key="2">

    //   </TabPane>
    // </Tabs>
  );
};

export default ManagetUser;
