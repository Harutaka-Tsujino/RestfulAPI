<?php
class Hex
{
    public function get($id)
    {
        $result = $this->request("SELECT * FROM t_hex WHERE id = '$id';");

        if ($result) 
        {
            foreach($result as $row) 
            {
                echo $row['hex'];
            }
        }
    }

    public function post($id, $param)
    {
        if (!isHexString($param)) return;

        $this->request("INSERT INTO t_hex (id, hex) VALUES ('$id', '$param');");
    }

    public function delete($id)
    {
        $this->request("DELETE FROM t_hex WHERE id = '$id';");
    }

    public function put($id, $param)
    {
        if (!isHexString($param)) return;

        $this->request("UPDATE t_hex SET hex = '$param' WHERE id = '$id';");
    }

    private function isHexString($str)
    {
        $length = strlen($str);

        if ($length < 6 || 8 < $length) return false;
        if (ctype_xdigit($param)) return false;

        return true;
    }

    private function request($query)
    {
        $link = mysqli_connect('localhost','har','T10772186h','hex');

        if (mysqli_connect_errno())
        {
            echo "データベースに接続できません:" . mysqli_connect_error() . "\n";
        }

        $result = mysqli_query($link, $query);

        mysqli_close($link);

        return $result;
    }
}
?>
