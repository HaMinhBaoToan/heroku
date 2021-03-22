import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../../utils/AppContext";
import { List, Avatar, Rate, Input, Button } from "antd";
import Swal from 'sweetalert2'
import CoursesServices from "../../../services/courses.service";
import CoursesTokenServices from "../../../services/coursesToken.service";
import moment from 'moment';

const CommentCourses = (props) => {

  let {
    userid
  } = useContext(AppContext);

  const { TextArea } = Input;

  const [data, setData] = useState([]);
  const [valueText, setValueText] = useState('');
  const [valueRate, setValueRate] = useState(0);
  const [hide, setHide] = useState(props.categories.IsCmt);
  const [rateValue, setRateValue] = useState(props.categories.RateValue);

  useEffect(() => {
    CoursesServices().getRateDetailByCategoryId(props.categories.CategoryId)
      .then((res) => {
        setData(res.data);
      })
  }, [props.categories, hide])
  function handleClickCmt() {
    if (valueText == '') {
      Swal.fire(
        'Vui lòng nhập nội dung'
      )
    }
    else if (valueRate == 0) {
      Swal.fire(
        'Bạn quên đánh giá kìa :( '
      )
    }
    else {
      const values = {
        UsersId: userid,
        CategoryId: props.categories.CategoryId,
        RateValue: valueRate,
        Cmt: valueText
      };

      CoursesTokenServices().addCmt(values).
        then((response) => {
          setHide(1);
          setRateValue(valueRate);
          Swal.fire(
            'Cảm ơn bạn đã góp ý ^^'
          )
        })
    }
  }

  const changeInputText = event => {
    setValueText(event.target.value);
  }

  const changeRate = event => {
    setValueRate(event);
  }



  return (
    <div className="">
      <h4>Đánh giá</h4>
      <div className="review-bx">
        <div className="all-review">
          <h2 className="rating-type">
            {data.length > 0 ? data.map(item => item.RateValue).reduce((prev, next) => prev + next) / data.length : 0}/5 <i className="fa fa-star" style={{ color: '#FFFF33' }} />
          </h2>
          <span>{data.length} Đánh giá </span>
        </div>
        <div className="review-bar">
          {
            props.quanRate.map((i, index) =>
              <div key={index} className="bar-bx">
                <div className="side">
                  <div>{index + 1} star</div>
                </div>
                <div className="middle">
                  <div className="bar-container">
                    <div className="bar-5" style={{ width: props.categories.TotalRate == 0 ? 0 : (i * 100 / props.categories.TotalRate) + '%' }} />
                  </div>
                </div>
                <div className="side right">
                  <div> {i}</div>
                </div>
              </div>
            )
          }
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        {
          props.categories.IsRes > 0 && hide === 0 ?
            <>
              <div className="m-b10">
                <TextArea value={valueText} onChange={changeInputText} rows={4} placeholder="Mời bạn để lại bình luận" />
              </div>
              <div className="m-t10 m-b20" >
                <span style={{ right: 150, position: 'absolute', fontWeight: 'bold' }}>  Đánh giá: <Rate value={valueRate} onChange={changeRate} /></span>
                <Button type="primary" shape="round" style={{ right: 0, position: 'absolute' }} onClick={() => handleClickCmt()}>
                  Gửi bình luận
                  </Button>

              </div>
            </>
            :
            hide === 1 ?
              <h5 className="text-center">Bạn đã đánh giá  {rateValue} <i className="fa fa-star" style={{ color: 'red' }} /> cho khóa học này</h5>
              :
              <></>
        }
        <div className="m-t50">{
          data.length > 0
            ?
            <List className="m-t20"
              itemLayout="horizontal"
              pagination={{
                onChange: page => {
                },
                pageSize: 5,
              }}
              dataSource={data}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.Image} />}
                    title={<div>
                      <h6>{item.DislayName} - <span style={{ fontSize: 12 }}> {moment(item.RateTime).format('DD/MM/yyyy')} </span> </h6>
                      <Rate allowHalf disabled value={item.RateValue} />

                    </div>}
                    description={<span> {item.Cmt} </span>}
                  />
                </List.Item>
              )}
            />
            :
            <h5 className="text-center">Chưa có đánh giá</h5>
        }
        </div>
      </div>
    </div>
  )
}


export default CommentCourses
