import React, { useState, useEffect, useContext } from "react";
import { Button, Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState, ContentState } from "draft-js";
import ReactHtmlParser from "react-html-parser";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import UserService from "../../../services/user.service";
import AuthService from "../../../services/auth.service";
import Source from "./Source";
import { AppContext } from "../../../utils/AppContext";

const InfoTeacher = () => {
  const { userid, nameUser } = useContext(AppContext);
  const [Note, setNote] = useState("");
  const [EditNote, setEditNote] = useState(false);
  const [editorState, seteditorState] = useState();

  useEffect(() => {
    AuthService()
      .getProfile({
        userId: userid,
      })
      .then((res) => {
        if(!res.data.user[0].TeacherNote)
        {
          res.data.user[0].TeacherNote = " <p> <span className='text-danger'>Chưa có mô tả</span></p>";
        }
        
        setNote(res.data.user[0].TeacherNote);
        const contentBlock = htmlToDraft(res.data.user[0].TeacherNote);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks
          );
          const editorStatetemp = EditorState.createWithContent(contentState);
          seteditorState(editorStatetemp);
        }
      });
  }, []);

  const onFinish = () => {
    setEditNote(false);
    UserService()
      .setSingleUser(userid, { TeacherNote: Note })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {});
  };
  const onEdit = () => {
    setEditNote(true);
  };
  const onEditorStateChange = (editorState) => {
    seteditorState(editorState);
    setNote(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  };

  return (
    <>
      <div className="profile-head">
        <h3 className="mr-2">{nameUser}</h3>
        <Tooltip title="Chỉnh sửa thông tin">
          <Button shape="circle" icon={<EditOutlined />} onClick={onEdit} />
        </Tooltip>
      </div>
      <div className="profile-head">
        <h5 className="ml-4">Thông tin</h5>
      </div>
      {EditNote ? (
        <>
          <div className="p-5 bg-white">
            <Editor
              editorState={editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={onEditorStateChange}
            />
          </div>

          <div className="profile-head">
            <button
              type="primary"
              className="btn login-form-button"
              onClick={onFinish}
            >
              Thay đổi thông tin
            </button>
          </div>
        </>
      ) : (
        <div className="profile-head">
          <div className="clearfix ml-4">{ReactHtmlParser(Note)}</div>
        </div>
      )}

      <div className="profile-head">
        <h5 className="ml-4">Danh sách khóa học</h5>
      </div>
      <div className="courses-filter">
        <div className="clearfix ml-4">
          <Source />
        </div>
      </div>
    </>
  );
};

export default InfoTeacher;
