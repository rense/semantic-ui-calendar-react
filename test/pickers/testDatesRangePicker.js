import { assert } from 'chai';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {
  shallow,
} from 'enzyme';
import sinon from 'sinon';
import React from 'react';
import _ from 'lodash';
import moment from 'moment';

import DatesRangePicker from '../../src/pickers/dayPicker/DatesRangePicker';
import DatesRangeView from '../../src/views/DatesRangeView';

Enzyme.configure({ adapter: new Adapter() });

describe('<DatesRangePicker />', () => {
  it('initialized with moment', () => {
    const date = moment('2015-05-01');
    const wrapper = shallow(<DatesRangePicker initializeWith={date} />);
    assert(
      moment.isMoment(wrapper.state('date')),
      'has moment instance in `date` state field');
    assert(
      wrapper.state('date').isSame(date),
      'initialize `date` state field with moment provided in `initializeWith` prop');
  });

  it('render <DayPicker /> properly', () => {
    const date = moment('2015-05-01');
    const wrapper = shallow(<DatesRangePicker
      initializeWith={date} />);
    assert(wrapper.is(DatesRangeView), 'renders <DatesRangeView />');
    assert(_.isArray(wrapper.prop('days')), 'provide array to `days` prop on DatesRangeView');
    assert.equal(wrapper.prop('days').length, 6 * 7, 'provide array of length 6 * 7 to `days` prop on DatesRangeView');
    wrapper.prop('days').forEach((day) => {
      assert(_.isString(day), 'contains strings');
    });
    assert(_.isFunction(wrapper.prop('onNextPageBtnClick')), 'provide function for `onNextPageBtnClick` prop on DatesRangeView');
    assert(_.isFunction(wrapper.prop('onPrevPageBtnClick')), 'provide function for `onPrevPageBtnClick` prop on DatesRangeView');
    assert(_.isFunction(wrapper.prop('onDayClick')), 'provide function for `onDayClick` prop on DatesRangeView');
    assert(_.isBoolean(wrapper.prop('hasPrevPage')), 'provide boolean for `hasPrevPage` prop on DatesRangeView');
    assert(_.isBoolean(wrapper.prop('hasNextPage')), 'provide boolean for `hasNextPage` prop on DatesRangeView');
    assert(_.isString(wrapper.prop('currentDate')), 'provide string for `currentDate` prop on DatesRangeView');
    assert(_.isObject(wrapper.prop('active')), 'provide object for `active` prop on DatesRangeView');
    assert(_.has(wrapper.prop('active'), 'start'), 'provide `active` prop with `start` field to DatesRangeView');
    assert(_.has(wrapper.prop('active'), 'end'), 'provide `active` prop with `end` field to DatesRangeView');
    assert(_.has(wrapper.props(), 'disabled'), 'provide `disabled` prop to DatesRangeView');
  });

  it('pass unhandled props to <DatesRangeView />', () => {
    const date = moment('2015-05-01');
    const wrapper = shallow(<DatesRangePicker
      a="prop a"
      b="prop b"
      initializeWith={date} />);
    assert(wrapper.is(DatesRangeView), 'renders <DatesRangeView />');
    assert.equal(wrapper.prop('a'), 'prop a', 'provide unhandled prop `a` to DatesRangeView');
    assert.equal(wrapper.prop('b'), 'prop b', 'provide unhandled prop `b` to DatesRangeView');
  });
});

describe('<DatesRangePicker />: buildDays', () => {
  const date = moment('2018-08-12');

  it('return array of strings', () => {
    const wrapper = shallow(<DatesRangePicker initializeWith={date} />);
    const shouldReturn = [
      '29', '30', '31', '1', '2', '3', '4',
      '5', '6', '7', '8', '9', '10', '11',
      '12', '13', '14', '15', '16', '17', '18',
      '19', '20', '21', '22', '23', '24', '25',
      '26', '27', '28', '29', '30', '31', '1',
      '2', '3', '4', '5', '6', '7', '8',
    ];
    assert(_.isArray(wrapper.instance().buildDays()), 'return array');
    assert.equal(wrapper.instance().buildDays().length, 42, 'return array of length 42');
    wrapper.instance().buildDays().forEach((date, i) => {
      assert.equal(date, shouldReturn[i], 'contains corect dates');
    });
  });
});

describe('<DatesRangePicker />: getActiveDays', () => {
  const date = moment('2018-08-12');

  it('return empty range when `start` and `end` props are undefined', () => {
    const wrapper = shallow(<DatesRangePicker
      initializeWith={date} />);
    /*
      [
      '29', '30', '31', '1', '2', '3', '4',
      '5', '6', '7', '8', '9', '10', '11',
      '12', '13', '14', '15', '16', '17', '18',
      '19', '20', '21', '22', '23', '24', '25',
      '26', '27', '28', '29', '30', '31', '1',
      '2', '3', '4', '5', '6', '7', '8',
    ]
    */
    assert(_.isObject(wrapper.instance().getActiveDays()), 'return object');
    assert(_.isUndefined(wrapper.instance().getActiveDays().start), 'return { start: undefined, ... }');
    assert(_.isUndefined(wrapper.instance().getActiveDays().end), 'return { end: undefined, ... }');
  });

  it('return half-filled range when `start` prop has value and `end` prop is undefined', () => {
    const wrapper = shallow(<DatesRangePicker
      start={moment('2018-08-06')}
      initializeWith={date} />);
    /*
      [
      '29', '30', '31', '1', '2', '3', '4',
      '5', '6', '7', '8', '9', '10', '11',
      '12', '13', '14', '15', '16', '17', '18',
      '19', '20', '21', '22', '23', '24', '25',
      '26', '27', '28', '29', '30', '31', '1',
      '2', '3', '4', '5', '6', '7', '8',
    ]
    */
    assert(_.isObject(wrapper.instance().getActiveDays()), 'return object');
    assert.equal(wrapper.instance().getActiveDays().start, 8, 'return { start: 8, ... }');
    assert(_.isUndefined(wrapper.instance().getActiveDays().end), 'return { end: undefined, ... }');
  });

  it('return full range when `start` prop has value and `end` prop has value', () => {
    const wrapper = shallow(<DatesRangePicker
      start={moment('2018-08-06')}
      end={moment('2018-08-12')}
      initializeWith={date} />);
    /*
      [
      '29', '30', '31', '1', '2', '3', '4',
      '5', '6', '7', '8', '9', '10', '11',
      '12', '13', '14', '15', '16', '17', '18',
      '19', '20', '21', '22', '23', '24', '25',
      '26', '27', '28', '29', '30', '31', '1',
      '2', '3', '4', '5', '6', '7', '8',
    ]
    */
    assert(_.isObject(wrapper.instance().getActiveDays()), 'return object');
    assert.equal(wrapper.instance().getActiveDays().start, 8, 'return { start: 8, ... }');
    assert.equal(wrapper.instance().getActiveDays().end, 14, 'return { end: 14, ... }');
  });
});

describe('<DatesRangePicker />: getDisabledDays', () => {
  const date = moment('2018-08-12');

  describe('return disabled days based on `maxDate` prop', () => {
    it('return disabled days position numbers', () => {
      const wrapper = shallow(<DatesRangePicker
        maxDate={moment('2018-08-22')}
        initializeWith={date} />);
      /*
        [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */
      const shouldReturn = [
        0, 1, 2,
        25, 26, 27, 28, 29, 30, 31, 32, 33,
        34, 35, 36, 37, 38, 39, 40, 41,
      ]; //disabled days position numbers
      assert(_.isArray(wrapper.instance().getDisabledDays()), 'return array of numbers');
      assert.equal(wrapper.instance().getDisabledDays().length, 20, 'return array of length 20');
      wrapper.instance().getDisabledDays().forEach((day) => {
        assert(_.isNumber(day), 'contains numbers');
      });
      const producedDays = wrapper.instance().getDisabledDays();
      shouldReturn.forEach((expectedDay) => {
        assert(_.includes(producedDays, expectedDay), 'contains correct posiotion numbers');
      });
    });
  });

  describe('return disabled days based on `minDate` prop', () => {
    it('return disabled days position numbers', () => {
      const wrapper = shallow(<DatesRangePicker
        minDate={moment('2018-08-04')}
        initializeWith={date} />);
      /*
        [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */
      const shouldReturn = [
        0, 1, 2,
        3, 4, 5,
        34, 35, 36, 37, 38, 39, 40, 41,
      ]; //disabled days position numbers
      assert(_.isArray(wrapper.instance().getDisabledDays()), 'return array of numbers');
      assert.equal(wrapper.instance().getDisabledDays().length, 14, 'return array of length 14');
      wrapper.instance().getDisabledDays().forEach((day) => {
        assert(_.isNumber(day), 'contains numbers');
      });
      const producedDays = wrapper.instance().getDisabledDays();
      shouldReturn.forEach((expectedDay) => {
        assert(_.includes(producedDays, expectedDay), 'contains correct posiotion numbers');
      });
    });
  });

  describe('return disabled days based on `minDate`, `maxDate` props', () => {
    it('return disabled days position numbers', () => {
      const wrapper = shallow(<DatesRangePicker
        minDate={moment('2018-08-04')}
        maxDate={moment('2018-08-29')}
        initializeWith={date} />);
      /*
        [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */
      const shouldReturn = [
        0, 1, 2, 3, 4, 5,
        32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
      ]; //disabled days position numbers
      assert(_.isArray(wrapper.instance().getDisabledDays()), 'return array of numbers');
      assert.equal(wrapper.instance().getDisabledDays().length, 16, 'return array of length 16');
      wrapper.instance().getDisabledDays().forEach((day) => {
        assert(_.isNumber(day), 'contains numbers');
      });
      const producedDays = wrapper.instance().getDisabledDays();
      shouldReturn.forEach((expectedDay) => {
        assert(_.includes(producedDays, expectedDay), 'contains correct posiotion numbers');
      });
    });
  });

  describe('return disabled days when none of `minDate`, `maxDate` props provided', () => {
    it('return disabled days position numbers (only days that are not in currently displayed month', () => {
      const wrapper = shallow(<DatesRangePicker
        initializeWith={date} />);
      /*
        [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */
      const shouldReturn = [
        0, 1, 2,
        34, 35, 36, 37, 38, 39, 40, 41,
      ]; //disabled days position numbers
      assert(_.isArray(wrapper.instance().getDisabledDays()), 'return array of numbers');
      assert.equal(wrapper.instance().getDisabledDays().length, 11, 'return array of length 11');
      wrapper.instance().getDisabledDays().forEach((day) => {
        assert(_.isNumber(day), 'contains numbers');
      });
      const producedDays = wrapper.instance().getDisabledDays();
      shouldReturn.forEach((expectedDay) => {
        assert(_.includes(producedDays, expectedDay), 'contains correct posiotion numbers');
      });
    });
  });
});

describe('<DatesRangePicker />: isNextPageAvailable', () => {
  const date = moment('2018-08-12');

  describe('is not available by maxDate', () => {
    /*
        [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */
    it('return false', () => {
      const wrapper = shallow(<DatesRangePicker
        maxDate={moment('2018-08-31')}
        initializeWith={date} />);
      
      assert(_.isBoolean(wrapper.instance().isNextPageAvailable()), 'return boolean');
      assert.isFalse(wrapper.instance().isNextPageAvailable(), 'return false');
    });
  });

  describe('available by maxDate', () => {
    /*
        [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */
    it('return true', () => {
      const wrapper = shallow(<DatesRangePicker
        maxDate={moment('2018-09-01')}
        initializeWith={date} />);
      
      assert(_.isBoolean(wrapper.instance().isNextPageAvailable()), 'return boolean');
      assert.isTrue(wrapper.instance().isNextPageAvailable(), 'return true');
    });
  });
});

describe('<DatesRangePicker />: isPrevPageAvailable', () => {
  const date = moment('2018-08-12');

  describe('is not available by minDate', () => {
    /*
        [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */
    it('return false', () => {
      const wrapper = shallow(<DatesRangePicker
        minDate={moment('2018-08-01')}
        initializeWith={date} />);
      
      assert(_.isBoolean(wrapper.instance().isPrevPageAvailable()), 'return boolean');
      assert.isFalse(wrapper.instance().isPrevPageAvailable(), 'return false');
    });
  });

  describe('available by minDate', () => {
    /*
        [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */
    it('return true', () => {
      const wrapper = shallow(<DatesRangePicker
        minDate={moment('2018-07-31')}
        initializeWith={date} />);
      
      assert(_.isBoolean(wrapper.instance().isPrevPageAvailable()), 'return boolean');
      assert.isTrue(wrapper.instance().isPrevPageAvailable(), 'return true');
    });
  });
});

describe('<DatesRangePicker />: getCurrentMonth', () => {
  const date = moment('2018-08-12');

  it('return string in format `MMMM YYYY`', () => {
    const wrapper = shallow(<DatesRangePicker
      initializeWith={date} />);
    
    assert(_.isString(wrapper.instance().getCurrentMonth()), 'return string');
    assert.equal(wrapper.instance().getCurrentMonth(), date.format('MMMM YYYY'), 'return proper value');
  });
});

describe('<DatesRangePicker />: handleChange', () => {
  const date = moment('2018-08-12');

  describe('`start` and `end` props are not provided', () => {
    it('call onChangeFake with { start: Moment, end: undefined }', () => {
      /*
        [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */
      const onChangeFake = sinon.fake();
      const wrapper = shallow(<DatesRangePicker
        onChange={onChangeFake}
        initializeWith={date} />);
      wrapper.instance().handleChange('click', { key: '17', value: '15'});
      const calledWithArgs = onChangeFake.args[0];
  
      assert(onChangeFake.calledOnce, 'onChangeFake called once');
      assert.equal(calledWithArgs[0], 'click', 'correct first argument');
      assert(moment.isMoment(calledWithArgs[1].value.start), 'has moment instance in `value.start`');
      assert(calledWithArgs[1].value.start.isSame(moment('2018-08-15'), 'date'), 'has correct moment instance in `value.start`');
      assert(_.isUndefined(calledWithArgs[1].value.end), 'has undefined in `value.end`');
    });
  });

  describe('`start` prop is provided, `end` prop is not provided', () => {
    it('call onChangeFake with { start: Moment, end: Moment }', () => {
      /*
        [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */
      const onChangeFake = sinon.fake();
      const wrapper = shallow(<DatesRangePicker
        onChange={onChangeFake}
        start={moment('2018-08-09')}
        initializeWith={date} />);
      wrapper.instance().handleChange('click', { key: '17', value: '15'});
      const calledWithArgs = onChangeFake.args[0];
  
      assert(onChangeFake.calledOnce, 'onChangeFake called once');
      assert.equal(calledWithArgs[0], 'click', 'correct first argument');
      assert(moment.isMoment(calledWithArgs[1].value.start), 'has moment instance in `value.start`');
      assert(
        calledWithArgs[1].value.start.isSame(moment('2018-08-09'), 'date'),
        'has correct moment instance in `value.start`');
      assert(moment.isMoment(calledWithArgs[1].value.end), 'has moment instance in `value.end`');
      assert(
        calledWithArgs[1].value.end.isSame(moment('2018-08-15'), 'date'),
        'has correct moment instance in `value.end`');
    });
  });

  describe('`start` prop is provided, `end` prop is provided', () => {
    it('call onChangeFake with { start: undefined, end: undefined }', () => {
      /*
        [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */
      const onChangeFake = sinon.fake();
      const wrapper = shallow(<DatesRangePicker
        onChange={onChangeFake}
        start={moment('2018-08-09')}
        end={moment('2018-08-10')}
        initializeWith={date} />);
      wrapper.instance().handleChange('click', { key: '17', value: '15'});
      const calledWithArgs = onChangeFake.args[0];
  
      assert(onChangeFake.calledOnce, 'onChangeFake called once');
      assert.equal(calledWithArgs[0], 'click', 'correct first argument');
      assert(_.isUndefined(calledWithArgs[1].value.start), 'has undefined in `value.start`');
      assert(_.isUndefined(calledWithArgs[1].value.end), 'has undefined in `value.end`');
    });
  });

  describe('`start` prop is provided, `end` prop is not provided, click on date before `start`', () => {
    it('call onChangeFake with { start: undefined, end: undefined }', () => {
      /*
        [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */
      const onChangeFake = sinon.fake();
      const wrapper = shallow(<DatesRangePicker
        onChange={onChangeFake}
        start={moment('2018-08-09')}
        initializeWith={date} />);
      wrapper.instance().handleChange('click', { key: '9', value: '7'});
      const calledWithArgs = onChangeFake.args[0];
  
      assert(onChangeFake.calledOnce, 'onChangeFake called once');
      assert.equal(calledWithArgs[0], 'click', 'correct first argument');
      assert(_.isUndefined(calledWithArgs[1].value.start), 'has undefined in `value.start`');
      assert(_.isUndefined(calledWithArgs[1].value.end), 'has undefined in `value.end`');
    });
  });
});

describe('<DatesRangePicker />: switchToNextPage', () => {
  const date = moment('2018-08-12');

  it('shift `date` state field one month forward', () => {
    const wrapper = shallow(<DatesRangePicker
      initializeWith={date} />);
    
    assert.equal(wrapper.state('date').month(), 7, 'month not changed yet');
    wrapper.instance().switchToNextPage();
    assert.equal(wrapper.state('date').month(), 7 + 1, 'month shifted one month forward');
  });
});

describe('<DatesRangePicker />: switchToPrevPage', () => {
  const date = moment('2018-08-12');

  it('shift `date` state field one month backward', () => {
    const wrapper = shallow(<DatesRangePicker
      initializeWith={date} />);
    
    assert.equal(wrapper.state('date').month(), 7, 'month not changed yet');
    wrapper.instance().switchToPrevPage();
    assert.equal(wrapper.state('date').month(), 7 - 1, 'month shifted one month backward');
  });
});