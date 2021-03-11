import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "video-react/dist/video-react.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

import React, { useState, useEffect } from "react";
import { Tabs, Spin } from "antd";

import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState, ContentState } from "draft-js";
import { Player } from "video-react"; // PosterImage
import {Image, Video, Transformation, CloudinaryContext} from 'cloudinary-react';
import Source from "./Source";
import CategoryService from "../../../services/category.service";
import "./ManagerSource.scss";
const { TabPane } = Tabs;

const ManagetUser = () => {
  const [content, setContent] = useState();
  const [editorState, seteditorState] = useState();
  const [editorStateDraft, seteditorStateDraft] = useState();
  const [datasource, setdatasource] = useState([]);
  const [timeLeft, setTimeLeft] = useState(1);

  useEffect(() => {
    APIgetAllCategory();
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
  return (
    <Tabs type="card">
      <TabPane tab="tab1" key="1">
        {timeLeft ? (
          renderSpin()
        ) : (
          <Source
            datasource={datasource}
            APIgetAllCategory={APIgetAllCategory}
          ></Source>
        )}
      </TabPane>
      <TabPane tab="tab2" key="2">
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

        <Player
          poster="http://res.cloudinary.com/dzyfkhpce/video/upload/v1613474027/Illustrator_CC_2018_Fundamentals_For_Beginners/01._Introduction_ixunyw.jpg"
          src="http://res.cloudinary.com/dzyfkhpce/video/upload/v1613474027/Illustrator_CC_2018_Fundamentals_For_Beginners/01._Introduction_ixunyw.mp4"
        />
      </TabPane>
    </Tabs>
  );
};

export default ManagetUser;
